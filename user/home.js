if (!Object.defineProperty) {
    alert('浏览器版本过低');
}

const MAJSOUL_CHANNEL_NAME = {0: '未知', 1: '国服', 2: '日服', 3: '国际服'};

const templateSource = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>{{title}}</title>
</head>
<body>
    <h1>{{title}}</h1>
    <p>{{content}}</p>
    <ul>
        {{#each items}}
        <li>{{this}}</li>
        {{/each}}
    </ul>
</body>
</html>
`;
const template = Handlebars.compile(templateSource);

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isNumeric(str) {
    // 判断是否为纯数字
    return /^\d+$/.test(str);
}

function isEmail(str) {
    // 判断是否为合法邮箱地址
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}


function majsoul_get_channel(player_id) {
    if (!player_id) {
        return 0
    }
    let prefix = parseInt(player_id) >> 23;
    if (0 <= prefix && prefix <= 6) {
        return 1
    }
    if (7 <= prefix && prefix <= 12) {
        return 2
    }
    if (13 <= prefix && prefix <= 15) {
        return 3
    }
    return 0
}

// import { ref } from 'vue';
const { createApp } = Vue;
const app = createApp({
    el: '#app',
    data: () => ({
        latest_login_request: new Date(),
        latest_check_request: new Date(),
        meter_login_value: 0,
        meter_check_value: 0,
        login_code: '',
        login_countdown_str: '',
        login_info_data: {},
        login_identifier: '',
        login_user_id: '',
        login_mail: '',
        login_token: '',
        login_group_name: '',
        login_group_id: '',
        title_adj: '',
        title_title: '',
        bilibili_uid: '',
        bilibili_nickname: '',
        input_login_identifier: '',
        input_login_code: '',
        input_set_user_id: '',
        input_set_mail: '',
        input_set_mail_code: '',
        input_set_bilibili_uid: '',
        input_adj: '',
        input_adj_id: '',
        input_title: '',
        input_title_id: '',
        input_title_idea: '',
        is_input_login_identifier_disabled: false,
        is_input_set_bilibili_uid_disabled: false,
        is_setting_user_id: false,
        is_setting_user_id_code: false,
        is_setting_mail: false,
        is_setting_mail_code: false,
        is_setting_bilibili_uid: false,
        is_setting_title: false,
        set_bilibili_uid_comment: '',
        error_message_login: undefined,
        error_message_set_user_id: undefined,
        error_message_set_mail: undefined,
        error_message_set_bilibili_uid: undefined,
        error_message_set_title: undefined,
        error_message_submit_idea: undefined,
        nickname: '',
        nickname_dict: {},
        nickname_option_list: [{value: '', label: '（不显示）'}],
        accounts: {
            arknights: {
                name: '明日方舟',
                account: '无',
                actions: [
                    {
                        type: 'button',
                        content: '更新token',
                        onclick: () => {handle_selecting_tab('arknights_update_token');},
                    },
                    {
                        type: 'checkbox',
                        content: `在 集集统计总榜（暂定） 公开集集统计数据`,
                        model: undefined,
                        onchange: () => {handle_switch_permission('arknights', 'ji_stats_open');},
                        show: false,
                    },
                    {
                        type: 'checkbox',
                        content: `如果公开，那么匿名`,
                        model: undefined,
                        onchange: () => {handle_switch_permission('arknights', 'ji_stats_anonymous');},
                        show: false,
                    },
                ]
            },
            steam: {
                name: 'Steam',
                account: '无',
                actions: [
                    {
                        type: 'button',
                        content: '关联SteamID',
                        onclick: () => {handle_selecting_tab('steam_set_player_id');},
                    },
                ],
            },
            majsoul: {
                name: '雀魂（牌谱屋）',
                account: '无',
                actions: [
                    {
                        type: 'button',
                        content: '关联雀魂牌谱屋ID',
                        onclick: () => {handle_selecting_tab('majsoul_set_player_id');},
                    },
                ],
            },
        },
        accounts_data: [],
        groups_data: [],
        title_data: [],
        same_group_count: 0,
        selecting_tab: '',
        is_loading: true,
        login_status: 'null',
        src_arknights_update_token: './arknights_update_token.html',
        src_steam_set_player_id: './steam_set_player_id.html',
        src_majsoul_set_player_id: './majsoul_set_player_id.html',
    }),
    mounted() {
        document.getElementById('p_kale').style.display = 'none';
        this.load_login_data();
        if (this.login_token && this.login_identifier) {
            this.login_status = 'waiting';
            this.get_login_info();
            this.update_meter();
        }
        window.get_login_info = this.get_login_info;
        window.set_group_ban = this.set_group_ban;
        window.handle_selecting_tab = this.handle_selecting_tab;
        window.handle_switch_permission = this.handle_switch_permission;
    },
    watch: {
        login_status(newVal) {
            // 调试 login_status 的变化
            console.log('login_status changed:', newVal);
        },
    },
    methods: {
        handleCopy(text) {
            console.log('点击复制');
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.value = text; // 修改文本框的内容
            input.select(); // 选中文本
            document.execCommand('copy'); // 执行浏览器复制命令
            document.body.removeChild(input);
            console.log('复制成功');
        },

        handleEnter(event) {
            // 根据输入框的 id 区分
            const input_id = event.target.id;
            if (input_id === 'input_login_identifier') {
                this.login();
            }
            else if (input_id === 'input_set_user_id') {
                this.handle_user_setting('set_user_id');
            }
            else if (input_id === 'input_set_mail') {
                this.is_setting_mail = false;
                this.is_setting_mail_code = true;
                this.handle_user_setting('set_mail');
            }
            else if (input_id === 'input_set_mail_code') {
                this.handle_user_setting('set_mail_code');
            }
            else if (input_id === 'ipput_set_bilibili_uid') {
                this.handle_user_setting('set_bilibili_uid');
            }


        },

        save_login_data() {
            if (!window.localStorage) {
                console.error('浏览器不支持localStorage');
            }
            else {
                console.log('保存登录信息');
                window.localStorage['login_identifier'] = this.login_identifier;
                window.localStorage['login_token'] = this.login_token;
                return true;
            }
        },

        load_login_data() {
            if (!window.localStorage) {
                console.error("浏览器不支持localStorage");
            }
            else {
                console.log('加载登录信息');
                if (!('login_token' in window.localStorage) || !('login_identifier' in window.localStorage)) {
                    console.log('没有找到已保存的登录信息');
                    return false;
                }
                this.login_identifier = window.localStorage['login_identifier'];
                this.login_token = window.localStorage['login_token'];
                return true;
            }
        },

        update_meter() {
            now = new Date();
            if (this.login_status == 'waiting' || this.login_status == 'waiting_code_qq') {
                // document.getElementById('meter_login').value = (now - this.latest_login_request) / 1000;
                // document.getElementById('meter_check').value = (now - this.latest_check_request) / 1000;
                this.meter_login_value = (now - this.latest_login_request) / 1000;
                this.meter_check_value = (now - this.latest_check_request) / 1000;
                let countdown_minute = Math.floor((this.latest_login_request - now + 300000) / 60000);
                let countdown_second = Math.floor((this.latest_login_request - now + 300000) / 1000 % 60);
                // document.getElementById('span_login_countdown').innerHTML = `${countdown_minute}:${countdown_second}`;
                this.login_countdown_str = `${countdown_minute}:${countdown_second}`;
                if (now - this.latest_login_request < 300000) {
                    setTimeout(this.update_meter, 10);
                }
            }
        },

        login() {
            const that = this;
            that.is_input_login_identifier_disabled = true;
            this.login_identifier = this.input_login_identifier;
            this.login_code = this.input_login_code;
            if (!(isNumeric(this.login_identifier) || isEmail(this.login_identifier))) {
                that.error_message_login = '不对不对不对，请输入正确格式的QQ号或邮箱';
                that.is_input_login_identifier_disabled = false;
                return;
            }
            if (isNumeric(that.login_identifier) || (isEmail(that.login_identifier) && that.login_code == '')) {
                that.latest_login_request = new Date();
                if (isNumeric(that.login_identifier)) {
                    that.login_status = 'waiting_code_qq';
                }
                if (isEmail(that.login_identifier)) {
                    that.login_status = 'waiting_code_mail';
                }
            }
            let xhr = new XMLHttpRequest();
            let payload = {
                'identifier': this.login_identifier,
                'code': this.login_code,
            }
            xhr.open('POST', 'https://yubo.run/api/kusa/login', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 20000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    if (data['error']) {
                        that.error_message_login = data['error'];
                        return;
                    }
                    if (isNumeric(that.login_identifier) || (isEmail(that.login_identifier) && that.login_code == '')) {
                        that.login_code = data['code'];
                        that.latest_check_request = new Date();
                        that.login_token = data['login_token'];
                        that.save_login_data();
                    }
                    console.log('login', that.login_identifier, that.login_token);
                    if (isNumeric(that.login_identifier)) {
                        that.login_status = 'waiting_code_qq';
                        ElementPlus.ElMessage({
                            message: `请求登录成功，请用 QQ ${that.login_identifier} 在群里发送验证码 ${that.login_code}`,
                            type: 'success',
                        });
                        setTimeout(that.get_login_info, 10000);
                    }
                    if (isEmail(that.login_identifier)) {
                        if (that.login_code == '') {
                            that.login_status = 'waiting_code_mail';
                            ElementPlus.ElMessage({
                                message: `请求登录成功，验证码已发送至 ${that.login_identifier}`,
                                type: 'success',
                            });
                        }
                        else if (data['success']) {
                            that.login_status = 'ok';
                            that.get_login_info();
                        }
                    }
                }
            }
            xhr.onerror = function() {
                console.log('请求出错，请稍后重试')
            }
            this.latest_login_request = new Date();
            xhr.send(JSON.stringify(payload));
            this.update_meter();
        },
        
        logout() {
            const that = this;
            let payload = {
                'identifier': this.login_identifier,
                'login_token': this.login_token,
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://yubo.run/api/kusa/logout', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 10000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    that.clear_login_data();
                    ElementPlus.ElMessage({
                        message: `退出登录成功`,
                        type: 'success',
                    });
                }
            }
            xhr.send(JSON.stringify(payload));
        },
        
        clear_login_data() {
            this.login_identifier = '';
            this.login_token = '';
            this.nickname = '';
            this.title_adj = '';
            this.title_title = '';
            this.login_group_name = '';
            this.login_group_id = '';
            this.save_login_data();
            window.location.reload();
        },
        
        get_login_info() {
            const that = this;
            let payload = {
                'identifier': that.login_identifier,
                'login_token': that.login_token,
            }
            axios.post('https://yubo.run/api/kusa/login_info', payload).then(res => {
                // if (res.data.code != 0) {
                // if (!res.data.ji_stats && !res.data.ji_log) {
                //     that.$alert(res.data.message, '获取记录失败');
                //     that.is_loading = false;
                //     return;
                // }
                that.last_update_timestamp = res.data.last_update_timestamp;
                that.latest_check_request = new Date();
                if (res.data.error) {
                    this.error_message_login = res.data.error;
                    that.clear_login_data();
                }
                else if (res.data.status == 'waiting' && now - that.latest_login_request < 300000) {
                    if (isNumeric(that.login_identifier)) {
                        that.latest_check_request = new Date();
                        setTimeout(that.get_login_info, 10000);
                    }
                    if (isEmail(that.login_identifier)) {
                        that.login_status = 'waiting_code_mail';
                        that.is_input_login_identifier_disabled = true;
                        that.input_login_identifier = that.login_identifier;
                    }
                }
                else if (res.data.status == 'success') {
                    that.save_login_data();
                    if (that.login_status != 'ok') {
                        ElementPlus.ElMessage({
                            message: `登录成功`,
                            type: 'success',
                        });
                    }
                    that.login_status = 'ok';
                    that.login_info_data = res.data;
                    that.selecting_tab = 'main';
                    that.init_main();
                    that.is_loading = false;
                }
                // console.log(that.same_group_count)
            }).catch(function (error) {
                that.$alert(error, '获取数据失败，请联系维护人员');
                that.is_loading = false;
                console.error(error);
                console.error(error.stack);
            });
        },

        get_group_info() {
            const that = this;
            this.is_loading = true;
            let payload = {
                'identifier': that.login_identifier,
                'login_token': that.login_token,
            }
            axios.post('https://yubo.run/api/kusa/group_info', payload).then(res => {
                that.last_update_timestamp = res.data.last_update_timestamp;
                that.latest_check_request = new Date();
                if (res.data.error) {
                    this.error_message_login = res.data.error;
                    that.clear_login_data();
                }
                else if (res.data.status == 'waiting' && now - that.latest_login_request < 300000) {
                    that.latest_check_request = new Date();
                    setTimeout(that.get_login_info, 10000);
                }
                else if (res.data.status == 'success') {
                    that.login_info_data.same_group_dict = res.data.same_group_dict;
                    that.login_info_data.is_superadmin = res.data.is_superadmin;
                    that.init_groups();
                    that.is_loading = false;
                }
                // console.log(that.same_group_count)
            }).catch(function (error) {
                that.$alert(error, '获取数据失败，请联系维护人员');
                that.is_loading = false;
                console.error(error);
                console.error(error.stack);
            });
        },

        handle_user_setting(action) {
            const that = this;
            let value = '';
            if (action == 'set_user_id') {
                if (isNumeric(this.input_set_user_id)) {
                    value = this.input_set_user_id;
                }
                else {
                    that.error_message_set_user_id = '你这QQ号对吗？';
                    return
                }
            }
            else if (action == 'set_mail') {
                if (isEmail(this.input_set_mail)) {
                    value = this.input_set_mail;
                    if (value == this.login_mail) {
                        that.is_setting_mail = true;
                        that.is_setting_mail_code = false;
                        that.error_message_set_mail = '已关联该邮箱';
                        return
                    }
                }
                else {
                    that.is_setting_mail = true;
                    that.is_setting_mail_code = false;
                    that.error_message_set_mail = '你这邮箱对吗？';
                    return
                }
            }
            else if (action == 'set_mail_code') {
                value = this.input_set_mail_code;
            }
            else if (action == 'set_bilibili_uid') {
                if (isNumeric(this.input_set_bilibili_uid)) {
                    value = this.input_set_bilibili_uid;
                }
                else {
                    that.error_message_set_bilibili_uid = '你这UID对吗？';
                    return
                }
            }
            else if (action == 'set_nickname') {
                value = this.nickname;
            }
            else if (action == 'set_adj') {
                value = this.input_adj_id;
            }
            else if (action == 'set_title') {
                value = this.input_title_id;
            }
            else if (action == 'submit_idea_adj' || action == 'submit_idea_title') {
                value = this.input_title_idea;
            }
            let payload = {
                'identifier': that.login_identifier,
                'login_token': that.login_token,
                'action': action,
                'value': value,
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `https://yubo.run/api/kusa/setting`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    if (action == 'set_user_id') {
                        that.is_setting_user_id_code = true;
                        that.login_code = data.code;
                    }
                    if (action == 'set_mail') {
                        if (data.error) {
                            that.is_setting_mail = true;
                            that.is_setting_mail_code = false;
                            that.error_message_set_mail = data.error;
                        }
                        else {
                            that.error_message_set_mail = undefined;
                        }
                    }
                    if (action == 'set_mail_code') {
                        that.error_message_set_mail = data.success || data.error;
                    }
                    if (action == 'set_bilibili_uid') {
                        if (data.error) {
                            that.error_message_set_bilibili_uid = data.error;
                        }
                        else {
                            that.set_bilibili_uid_comment = data.comment;
                            that.is_input_set_bilibili_uid_disabled = true;
                            that.error_message_set_bilibili_uid = undefined;
                        }
                    }
                    if (action == 'submit_idea_adj' || action == 'submit_idea_title') {
                        if (data.error) {
                            that.error_message_submit_idea = data.error;
                        }
                        else {
                            that.error_message_submit_idea = data.success;
                        }
                    }
                }
            }
            xhr.send(JSON.stringify(payload));
        },

        handle_set_title() {
            const that = this;
            this.is_setting_title = true;
            // 加载称号数据
            this.error_message_set_title = '正在加载称号数据……';
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://yubo.run/user/title.json`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    that.title_data = JSON.parse(xhr.responseText);
                    that.error_message_set_title = `成功加载了
                        ${that.title_data.adj.length}个前缀、
                        ${that.title_data.title.length}个称号，
                        数据最后更新于 ${new Date(1000 * that.title_data.last_update_timestamp)}`;
                }
                else {
                    that.error_message_set_title = '加载失败，请稍后重试';
                }
            }
            xhr.onerror = function() {
                console.log('加载失败，请稍后重试');
                that.error_message_set_title = '加载失败，请稍后重试';
            }
            xhr.send();
        },

        init_main() {
            this.login_user_id = this.login_info_data.user_id;
            this.login_mail = this.login_info_data.mail;
            this.nickname = this.login_info_data.nickname;
            this.title_adj = this.login_info_data.title_adj;
            this.title_title = this.login_info_data.title_title;
            this.bilibili_uid = this.login_info_data.bilibili.uid;
            this.bilibili_nickname = this.login_info_data.bilibili.nickname;
            this.login_group_name = this.login_info_data.login_group_name;
            this.login_group_id = this.login_info_data.login_group_id;
            this.same_group_count = this.login_info_data.same_group_count;
            // this.nickname = this.nickname || '（不显示）';
            this.nickname_dict = {
                'null': '',
                'bilibili_nickname': this.bilibili_nickname,
                'arknights_nickname': this.login_info_data.arknights.nickname,
            }
            this.nickname_option_list = [
                {
                    value: 'null',
                    label: '（不显示）',
                },
                {
                    value: 'bilibili_nickname',
                    label: this.bilibili_nickname
                        ? `${this.bilibili_nickname}（哔哩哔哩）`
                        : '未关联哔哩哔哩账号',
                    disabled: !this.bilibili_nickname,
                },
                {
                    value: 'arknights_nickname',
                    label: this.login_info_data.arknights.nickname
                        ? `${this.login_info_data.arknights.nickname}（明日方舟）`
                        : '未关联明日方舟账号',
                    disabled: !this.login_info_data.arknights.nickname,
                },
                {
                    value: 'arknights_nickname_clear',
                    label: this.login_info_data.arknights.nickname
                        ? `${this.login_info_data.arknights.nickname.split('#')[0]}（明日方舟，不含#数字部分）`
                        : '未关联明日方舟账号',
                    disabled: !this.login_info_data.arknights.nickname,
                },
            ]
            window.login_identifier = this.login_identifier;
            window.login_user_id = this.login_user_id;
            window.login_mail = this.login_mail;
            window.login_token = this.login_token;
            if (Object.keys(this.login_info_data.arknights).length > 0) {
                this.accounts.arknights.actions[1].show = true;
                this.accounts.arknights.actions[1].model = this.login_info_data.arknights.is_ji_stats_open;
                this.accounts.arknights.actions[2].show = true;
                this.accounts.arknights.actions[2].model = this.login_info_data.arknights.is_ji_stats_anonymous;
                this.accounts.arknights.actions[2].content = `如果公开，那么匿名（显示为${this.login_info_data.arknights.anonymous_nickname}）`;
            }

            this.accounts_data = [];
            for (let name in this.accounts) {
                this.accounts_data.push(this.accounts[name]);
            }

            if (!isEmpty(this.login_info_data.arknights)) {
                let arknights_user_id = this.login_info_data.arknights.channel == 1 ? `(官服 ${this.login_info_data.arknights.uid})` : this.login_info_data.arknights.channel == 2 ? `(B服 ${this.login_info_data.arknights.uid})` : '';
                let arknights_token_invalid = this.login_info_data.arknights.is_token_invalid ? '（token已失效）' : '';
                this.accounts.arknights.account = `${this.login_info_data.arknights.nickname} ${arknights_user_id}${arknights_token_invalid}`;
            }
            if (!isEmpty(this.login_info_data.steam)) {
                this.accounts.steam.account = `${this.login_info_data.steam.nickname} (${this.login_info_data.steam.steam_id3})`;
            }
            if (!isEmpty(this.login_info_data.majsoul)) {
                this.accounts.majsoul.account = `${this.login_info_data.majsoul.nickname} (${MAJSOUL_CHANNEL_NAME[majsoul_get_channel(this.login_info_data.majsoul.uid)]} ${this.login_info_data.majsoul.uid})`;
            }
        },

        init_groups() {
            let same_group_as_role = {
                'owner': [],
                'admin': [],
                'member': [],
                'superadmin': [],
            }
            for (let group_id in this.login_info_data.same_group_dict) {
                let group_info = this.login_info_data.same_group_dict[group_id];
                let role_class = '', role_str = '';
                let is_admin = false;
                if (this.login_info_data.is_superadmin) {
                    is_admin = true;
                    if (isEmpty(group_info['group_member_info_user']) || group_info['group_member_info_user']['role'] == 'superadmin') {
                        group_info['group_member_info_user']['role'] = 'superadmin';
                        role_class = 'span_bot_admin'
                        role_str = '只是路过的bot管理员';
                    }
                }
                if (group_info['group_member_info_user']['role'] == 'owner') {
                    role_class = 'span_group_owner'
                    role_str = '群主';
                    is_admin = true;
                }
                if (group_info['group_member_info_user']['role'] == 'admin') {
                    role_class = 'span_group_admin'
                    role_str = '管理员';
                    is_admin = true;
                }
                let bot_has_permission = ((group_info['group_member_info_bot']['role'] == 'owner') || group_info['group_member_info_bot']['role'] == 'admin' && group_info['group_member_info_user']['role'] == 'member')

                group_info['group_id'] = group_id;
                group_info['is_admin'] = is_admin;
                group_info['role_class'] = role_class;
                group_info['role_str'] = role_str;
                group_info['bot_has_permission'] = bot_has_permission;
                same_group_as_role[group_info['group_member_info_user']['role']].push(group_info);
            }
            this.groups_data = [...same_group_as_role['owner'], ...same_group_as_role['admin'], ...same_group_as_role['member'], ...same_group_as_role['superadmin']];
        },

        handle_selecting_tab(tab) {
            console.log(tab);
            this.selecting_tab = tab;
            if (tab == 'main') {
                this.get_login_info();
            }
            if (tab == 'groups') {
                this.get_group_info();
            }
        },

        handle_tab_click(tab, event) {
            console.log(tab.paneName);
            if (tab.paneName == 'main') {
                this.get_login_info();
            }
            if (tab.paneName == 'groups') {
                this.get_group_info();
            }
        },

        create_filter_adj(queryString) {
            return (adj_item) => {
                return adj_item.value.indexOf(queryString) === 0;
            }
        },

        create_filter_title(queryString) {
            return (title_item) => {
                return title_item.value.indexOf(queryString) === 0;
            }
        },

        query_search_adj(queryString, cb) {
            const results = queryString
                ? this.title_data.adj.filter(this.create_filter_adj(queryString))
                : this.title_data.adj;
            // call callback function to return suggestions
            cb(results);
        },

        query_search_title(queryString, cb) {
            const results = queryString
                ? this.title_data.title.filter(this.create_filter_title(queryString))
                : this.title_data.title;
            // call callback function to return suggestions
            cb(results)
        },

        handle_select_adj(item) {
            this.input_adj_id = item.id;
            this.title_adj = item.value;
            this.handle_user_setting('set_adj');
        },

        handle_select_title(item) {
            this.input_title_id = item.id;
            this.title_title = item.value;
            this.handle_user_setting('set_title');
        },

        handle_handlebar(target) {
            let cate_str;
            if (target == 'adj') {
                cate_str = '前缀';
            }
            if (target == 'title') {
                cate_str = '称号';
            }
            const data = {
                title: `${cate_str}列表`,
                content: `这是${cate_str}列表，你可以使用Ctrl+F搜索想要的${cate_str}`,
                items: Object.values(this.title_data[target]).map(item => item.value),
            }
            const html = template(data);
            const blob = new Blob([html], { type: 'text/html' });
            window.open(URL.createObjectURL(blob), '_blank');
        },

        handle_switch_permission(module_name, permission_name) {
            const that = this;
            this.is_loading = true;
            let payload = {
                'user_id': that.login_user_id,
                'login_token': that.login_token,
                'permission_name': permission_name,
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `https://yubo.run/api/${module_name}/switch_permission`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    that.get_login_info();
                }
            }
            xhr.send(JSON.stringify(payload));
        },
        
        handle_switch_module(group_id, module_name) {
            const that = this;
            this.is_loading = true;
            let payload = {
                'user_id': this.login_user_id,
                'login_token': this.login_token,
                'group_id': group_id,
                'module_name': module_name,
                'nickname': this.nickname,
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://yubo.run/api/kusa/switch_module', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    that.get_group_info();
                }
            }
            xhr.send(JSON.stringify(payload));
        },

        set_group_ban(group_id, user_id) {
            const that = this;
            let payload = {
                'user_id': this.login_user_id,
                'login_token': this.login_token,
                'group_id': group_id,
                'code': null,
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://yubo.run/api/kusa/set_group_ban', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    that.get_login_info();
                }
            }
            xhr.send(JSON.stringify(payload));
        },
    },
    // delimiters: ['[[', ']]'],
})

app.use(ElementPlus);
app.mount('#app');
