if (!Object.defineProperty) {
    alert('浏览器版本过低');
}

const STATUS = {
    waiting: '等待开始',
    selecting: '选择阶段',
    judging: '判定阶段',
    finished: '已结束',
};

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

class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.messageQueue = [];
        this.isConnected = false;
        this.messageHandler = null; // 存储消息处理函数
        this.initSocket();
    }

    initSocket() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            this.isConnected = true;
            this.flushQueue();
            // 如果已经有消息处理函数，立即设置
            if (this.messageHandler) {
                this.socket.onmessage = this.messageHandler;
            }
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            ElementPlus.ElMessage({
                message: '已断开连接，重新连接请刷新',
                type: 'error',
                duration: 0,
                // showClose: true,
            });
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            ElementPlus.ElMessage({
                message: '服务器繁忙，请稍后再试',
                type: 'error',
                duration: 0,
                // showClose: true,
            });
        };
    }

    // 添加额外的 open 监听器（不会覆盖原有逻辑）
    addOpenListener(listener) {
        const originalOnOpen = this.socket.onopen;
        this.socket.onopen = (event) => {
          originalOnOpen?.call(this.socket, event); // 先执行原有逻辑
          listener.call(this.socket, event);        // 再执行自定义逻辑
        };
    }

    // 设置/修改消息处理函数
    setOnMessageHandler(handler) {
        this.messageHandler = handler;
        // 如果已经连接，立即应用新的处理函数
        if (this.isConnected) {
            this.socket.onmessage = handler;
        }
    }

    send(message) {
        if (this.isConnected) {
            this.socket.send(message);
        } else {
            this.messageQueue.push(message);
        }
    }

    flushQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.socket.send(message);
        }
    }

    reconnect() {
        if (!this.isConnected) {
            this.initSocket();
        }
    }
}

// import { ref } from 'vue';
const { createApp } = Vue;
const app = createApp({
    el: '#app',
    data: () => ({
        latest_login_request: new Date(),
        last_room_list_update: new Date(),
        selections: {
            'null': '无',
            'left': '左',
            'right': '右',
            'draw': '平局',
            'win': '钱来！',
            'loss': '钱去！',
            'out': '出局',
            '10': '10%',
            '30': '30%',
            '60': '60%',
            '99': '99%',
            '100': 'ALL',
        },
        login_info_data: {},
        login_identifier: '',
        login_user_id: '',
        login_mail: '',
        login_token: '',
        is_vip: false,
        title_adj: '',
        title_title: '',
        bilibili_uid: '',
        bilibili_nickname: '',
        input_adj: '',
        input_adj_id: '',
        input_title: '',
        input_title_id: '',
        input_title_idea: '',
        is_in_lobby: false,
        is_in_room: false,
        online_players: 0,
        room_list: [],
        form_create_room: {
            max_players: 10,
            allow_99: '1',
            allow_all: '6',
            bilibili_live_room_id: '',
        },
        current_room: {},
        current_room_status: '',
        current_room_title_comment: '',
        current_room_bilibili_live_room_id: '',
        current_room_player_list: [],
        current_room_round: {},
        current_room_round_list: [],
        current_room_round_number: 0,
        current_player_choice_list: [],
        is_99_disabled: false,
        is_all_disabled: false,
        is_ready: false,
        is_eliminated: false,
        is_all_players_ready: false,
        is_setting_title: false,
        error_message_set_title: undefined,
        error_message_submit_idea: undefined,
        nickname: '',
        nickname_dict: {},
        nickname_option_list: [{value: '', label: '（不显示）'}],
        title_data: [],
        button_types: {},
        selecting_tab: '',
        is_obs: false,
        is_loading: true,
        is_button_disabled: false,
        is_show_scoreboard: true,
        is_getting_room_info: false,
        is_create_room_disabled: false,
        is_leave_room_dialog_visible: false,
        login_status: 'null',
    }),
    mounted() {
        document.getElementById('p_kale').style.display = 'none';
        this.load_login_data();
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

        toLargestChineseUnit(num) {
            if (isNaN(num)) return '无效数字';
            if (num === 0) return '0';
            const prefix = num < 0 ? '-' : '';
            const units = ['', '万', '亿', '兆'];
            let unitIndex = 0;
            num = Math.abs(Math.floor(num));
            // 找到最大的单位
            while (num >= 10000 && unitIndex < units.length - 1) {
                num = Math.floor(num / 10000);
                unitIndex++;
            }
            return prefix + num + units[unitIndex];
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
                if (this.login_identifier == '' && this.login_token == '') {
                    console.log('已保存的登录信息为空');
                }
                return true;
            }
        },

        enter() {
            this.is_in_lobby = true;
            this.load_login_data();
            if (this.login_token && this.login_identifier) {
                this.login_status = 'waiting';
                this.get_login_info();
            }
            else {
                // 未登录直接跳转
                window.location.href = `https://yubo.run/user/`;
            }
        },

        get_room_info_or_room_list() {
            const that = this;
            this.is_loading = true;
            this.is_getting_room_info = true;
            this.last_room_list_update = new Date();
            // this.is_button_disabled = true;
            // setTimeout(this.release_button, 500);
            that.handle_command('get_room_info_or_room_list');
        },

        update_room_info_or_room_list() {
            const that = this;
            // // 检查是否在大厅
            // if (!that.is_in_lobby) return;
            that.get_room_info_or_room_list();
            // 再次检查
            if (that.is_in_lobby) {
                setTimeout(that.update_room_info_or_room_list, 5000);
            }
            else if (that.is_in_room){
                setTimeout(that.update_room_info_or_room_list, 2000);
            }
        },

        create_room() {
            const that = this;
            if (that.is_create_room_disabled) {
                return
            }
            that.is_create_room_disabled = true;
            let payload = {
                'identifier': that.login_identifier,
                'login_token': that.login_token,
                'settings': JSON.stringify(that.form_create_room),
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `https://yubo.run/api/ququ/create_room`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    if (data.status == 'success') {
                        that.get_room_info_or_room_list();
                    }
                }
            }
            xhr.send(JSON.stringify(payload));
        },

        disband_room() {
            const that = this;
            if (!(that.current_room.owner_id == that.user_id)) {
                return
            }
            this.handle_command('disband_room');
        },

        join_room(room_code) {
            this.handle_command(`join_room_${room_code}`);
        },

        leave_room(is_force) {
            if (this.is_owner && !is_force) {
                this.is_leave_room_dialog_visible = true;
                return
            }
            else {
                this.is_in_lobby = true;
                this.is_in_room = false;
                this.is_leave_room_dialog_visible = false;
                this.is_create_room_disabled = false;
                this.is_getting_room_info = false;
                this.handle_command('leave_room');
            }
        },

        kick_player(user_id) {
            this.handle_command(`kick_player_${user_id}`);
        },

        toggle_show_scoreboard() {
            this.is_show_scoreboard = !this.is_show_scoreboard;
        },

        toggle_ready() {
            this.is_button_disabled = true;
            setTimeout(this.release_button, 1000);
            this.handle_command('toggle_ready');
        },

        start_game() {
            this.handle_command('start');
        },

        restart_game() {
            // restart
            this.handle_command('start');
        },

        select(side, scale) {
            this.is_button_disabled = true;
            setTimeout(this.release_button, 1000);
            this.handle_command(`select_${this.current_room_round_number}_${side}_${scale}`);
        },

        end_selecting() {
            this.handle_command(`end_selecting`);
        },

        judge(winner) {
            this.handle_command(`judge_${this.current_room_round_number}_${winner}`);
        },

        handle_command(command) {
            const that = this;
            console.log(command);
            that.ws.send(command);
        },

        handle_websocket_message(data) {
            const that = this;
            console.log(data);
            if (data.hasOwnProperty('is_in_lobby')) {
                if(!that.is_in_lobby) that.selecting_tab = 'room_list';
                that.is_in_lobby = data.is_in_lobby;
            }
            if (data.hasOwnProperty('is_in_room')) {
                that.is_in_room = data.is_in_room;
            }
            if (data.alert) {
                ElementPlus.ElMessageBox(data.alert);
            }
            if (data.message) {
                ElementPlus.ElMessage(data.message);
            }
            if (data.online_players) {
                that.online_players = data.online_players;
            }
            if (data.join_room) {
                let message = `${data.join_room.nickname}【${that.title_data.adj_map[data.join_room.adj_id]}${that.title_data.title_map[data.join_room.title_id]}】加入了房间`;
                let type = 'info';
                if (data.join_room.is_vip) {
                    message = '🚁 尊贵的 ' + message + ' 🚁';
                    type = 'warning';
                }
                ElementPlus.ElMessage({
                    message: message,
                    type: type,
                });
            }
            if (data.leave_room) {
                let message = `${data.leave_room.nickname}【${that.title_data.adj_map[data.leave_room.adj_id]}${that.title_data.title_map[data.leave_room.title_id]}】离开了房间`;
                let type = 'info';
                if (data.leave_room.is_vip) {
                    message = '🚁 尊贵的 ' + message + ' 🚁';
                    if (data.leave_room.is_kicked) {
                        message = '💥' + message + '💥';
                    }
                    type = 'warning';
                }
                ElementPlus.ElMessage({
                    message: message,
                    type: type,
                });
            }
            if (data.kicked) {
                ElementPlus.ElMessageBox(`你被房主踢出了房间 ${data.kicked}`);
            }
            if (data.disband_room) {
                ElementPlus.ElMessageBox(`房间 ${data.disband_room.room_code} 已被房主解散`);
            }
            if (data.toggle_ready) {
                that.current_room.players[data.toggle_ready.user_id].is_ready = data.toggle_ready.is_ready;
            }
            if (data.start) {
                ElementPlus.ElMessage(data.start);
            }
            if (data.select) {
                console.log(data.select)
                for (let i = 0; i < that.current_room.round_list.length; i++) {
                    if (that.current_room.round_list[i].round_number == data.select.round_number) {
                        that.current_room.round_list[i].choices.push({
                            user_id: data.select.user_id,
                            round_number: data.select.round_number,
                            side: data.select.side,
                            scale: data.select.scale,
                            selected_option: `${data.select.side}_${data.select.scale}`,
                        })
                        break
                    }
                }
            }
            if (data.end_selecting) {
                ElementPlus.ElMessage(data.end_selecting);
            }
            if (data.judge) {
                ElementPlus.ElMessage(data.judge);
            }
            if (that.is_in_lobby) {
                if (data.room_list) {
                    that.room_list = data.room_list;
                }
                that.is_loading = false;
                that.is_getting_room_info = false;
                this.is_create_room_disabled = false;
            }
            if (that.is_in_room) {
                if (data.room) {
                    that.current_room = data.room;
                }
                if (data.player_choice) {
                    that.current_room_player_choice_list.push(data.player_choice);
                }
                this.is_create_room_disabled = true;
                that.handle_room_update();
            }
        },

        handle_room_update() {
            const that = this;
            if (that.is_in_lobby && !that.is_in_room) return;
            that.current_room_bilibili_live_room_id = that.current_room.settings.bilibili_live_room_id;
            that.current_room_round_list = that.current_room.round_list;
            if (that.current_room_round_list.length) {
                that.current_room_round = that.current_room_round_list[that.current_room_round_list.length - 1];
                that.current_room_round_number = that.current_room_round.round_number;
            }
            that.current_room.alive_players = 0;
            that.current_room.selected_player_set = new Set();
            Object.values(that.current_room.players).forEach(player => {
                player.choices = {};
                that.current_room.alive_players += !(player.is_eliminated);
            });
            Object.values(that.current_room_round_list).forEach(round => {
                round.choices.forEach(choice => {
                    let selection_split = choice.selected_option.split('_');
                    that.current_room.players[choice.user_id].choices[choice.round_number] = {
                        side: selection_split[0],
                        scale: selection_split[1],
                        is_correct: choice.is_correct,
                        score_earned: choice.score_earned,
                    }
                    if (choice.round_number == that.current_room_round_number) {
                        that.current_room.players[choice.user_id].is_selected = true;
                        that.current_room.selected_player_set.add(choice.user_id);
                    }
                })
            });
            that.current_room_player_list = Object.values(that.current_room.players).map(player => player);
            that.is_all_players_ready = that.current_room_player_list.every(player => player.is_ready === true);
            that.is_owner = (that.user_id == that.current_room.owner_id);
            that.is_99_disabled = (that.current_room_round_number < parseInt(that.current_room.settings.allow_99));
            that.is_all_disabled = (that.current_room_round_number < parseInt(that.current_room.settings.allow_all));
            that.is_ready = that.current_room.players[that.user_id].is_ready;
            that.is_eliminated = that.current_room.players[that.user_id].is_eliminated;
            if (that.current_room.status == 'waiting') {
                that.current_room_status = `${STATUS[that.current_room.status]} (${that.current_room.current_players}/${that.current_room.max_players})`;
            }
            else if (that.current_room.status == 'playing') {
                let current_round_status = '';
                if (that.current_room_round.status == 'selecting') {
                    current_round_status = `${STATUS[that.current_room_round.status]} (${that.current_room.selected_player_set.size}/${that.current_room.alive_players} 已选择)`;
                }
                else {
                    current_round_status = `${STATUS[that.current_room_round.status]}`
                }

                that.current_room_status = `第${that.current_room_round_number}轮 ${current_round_status}`;
            }
            that.is_loading = false;

            console.log(that.current_room);
        },

        get_login_info() {
            const that = this;
            let payload = {
                'identifier': that.login_identifier,
                'login_token': that.login_token,
            }
            axios.post('https://yubo.run/api/kusa/login_info', payload).then(res => {
                if (res.data.error) {
                    this.error_message_login = res.data.error;
                    window.location.href = `https://yubo.run/user/`;
                }
                else if (res.data.status == 'waiting' && now - that.latest_login_request < 300000) {
                    window.location.href = `https://yubo.run/user/`;
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
                    that.selecting_tab = 'room_list';
                    that.init_main();
                    that.is_loading = false;
                    that.init_websocket();
                    that.handle_command(JSON.stringify(payload));
                    that.get_title_data();
                    that.update_room_info_or_room_list();
                }
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
            if (action == 'set_nickname') {
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
                if (value.length == 0) {
                    that.error_message_submit_idea = '提交的内容不能为空';
                    return
                }
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

        get_title_data() {
            // 加载称号数据
            const that = this;
            that.error_message_set_title = '正在加载称号数据……';
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://yubo.run/user/title.json`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.timeout = 5000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    that.title_data = JSON.parse(xhr.responseText);
                    that.title_data.adj_map = that.title_data.adj.reduce((acc, item) => {
                            acc[item.id] = item.value;
                            return acc;
                        }, {});
                    that.title_data.title_map = that.title_data.title.reduce((acc, item) => {
                            acc[item.id] = item.value;
                            return acc;
                        }, {});
                    that.error_message_set_title = `成功加载了${that.title_data.adj.length}个前缀、${that.title_data.title.length}个称号，
                        数据最后更新于 ${new Date(1000 * that.title_data.last_update_timestamp)}`;
                    console.log(that.error_message_set_title);
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

        set_title() {
            this.is_setting_title = true;
            if (this.title_data.length == 0) {
                this.get_title_data();
            }
        },

        init_main() {
            this.user_id = this.login_info_data.id;
            this.login_user_id = this.login_info_data.user_id;
            this.login_mail = this.login_info_data.mail;
            this.nickname = this.login_info_data.nickname;
            this.is_vip = this.login_info_data.is_vip;
            this.title_adj = this.login_info_data.title_adj;
            this.title_title = this.login_info_data.title_title;
            this.bilibili_uid = this.login_info_data.bilibili.uid;
            this.bilibili_nickname = this.login_info_data.bilibili.nickname;
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
        },

        init_websocket() {
            const that = this;
            that.ws = new WebSocketManager('wss://yubo.run/api/ququ/ws');
            that.ws.setOnMessageHandler(function(event) {
                data = JSON.parse(event.data);
                that.handle_websocket_message(data);
            });
        },

        handle_selecting_tab(tab) {
            console.log(tab);
            this.selecting_tab = tab;
        },

        handle_tab_click(tab, event) {
            console.log(tab.paneName);
        },

        release_button() {
            this.is_button_disabled = false;
        },

        select_adj(item) {
            this.input_adj_id = item.id;
            this.title_adj = item.value;
            this.handle_user_setting('set_adj');
        },

        select_title(item) {
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

        handle_cell_class({ row, column, rowIndex, columnIndex }) {
            const columnOffset = this.is_owner ? 4 : 3;
            if ((columnIndex == 1 || columnIndex == 2) && row.is_eliminated === true) {
                return 'eliminated'
            }
            if (
                columnIndex > columnOffset &&
                row.choices[columnIndex - columnOffset] &&
                row.choices[columnIndex - columnOffset].is_correct == null &&
                this.current_room_round_number == columnIndex - columnOffset
            ) {
                return 'selected-cell'
            }
            if (columnIndex > columnOffset && row.choices[columnIndex - columnOffset] && row.choices[columnIndex - columnOffset].is_correct === true) {
                return 'correct-cell'
            }
            else if (columnIndex >= columnOffset && row.choices[columnIndex - columnOffset] && row.choices[columnIndex - columnOffset].is_correct === false) {
                return 'incorrect-cell'
            }
            return ''
        },
    },
    // delimiters: ['[[', ']]'],
})

app.use(ElementPlus);
app.mount('#app');
