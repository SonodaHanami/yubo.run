if (!Object.defineProperty) {
    alert('浏览器版本过低');
}

const numberFormatter = num => {
    if (num < 10000)
        return `${num.toLocaleString()}`
    if (num < 100000000)
        return `${(num / 10000).toLocaleString()} W`
    return `${(num / 100000000).toLocaleString()} E`
}

const ROGUE_NAMES = {
    'rogue_2': '傀影与猩红孤钻',
    'rogue_3': '水月与深蓝之树',
    'rogue_4': '探索者的银凇止境',
    'rogue_5': '萨卡兹的无终奇语',
}

const ROGUE_STARTS = {
    'rogue_2': '2022-01-05',
    'rogue_3': '2022-09-27',
    'rogue_4': '2023-07-13',
    'rogue_5': '2024-07-16',
}

const ENDINGS_3 = {
    1: '平凡即是喜乐',
    2: '静谧时代',
    3: '息潮的代价',
    4: '如星空般深蓝',
}

const ENDINGS_4 = {
    1: '越过群山',
    2: '直至冬夜降临',
    3: '自深处的一瞥',
    4: '终始',
}

const ENDINGS_5 = {
    1: '憧憬未来',
    2: '双王记',
    3: '天使之城',
    4: '遁入阇那',
    5: '无瑕之日',
}

const CHART_NAMES = {
    'node_and_invest': '通过节点与存入源石锭',
    'clear': '通关次数',
    'node': '通过节点',
    'invest': '存入源石锭', 
    'endings': '通关结局个数比例',
    'dice': '累计投掷骰子次数',
    'coin': '累计在阿戈尔打印机中的投币次数',
    'vision': '累计消耗抗干扰指数',
    'game': '在【北地巫师竞技】中“连输五次”的博士', 
    'spring': '在【度假胜地】中入住度假村的博士',
    'height': '遇到了【负伤的主树】的博士',
    'alchemy': '累计解读次数',
    'amiya': '看到了阿米娅的纪念碑的博士比例',
    'persuade': '累计触发圣卫铳骑的劝导次数',
    'goldSave': '累计请坎诺特“降价”的源石锭数量',
    'tempUpgrade': '累计完成印象加深的次数',
}

const OPERATOR_NAMES = {
    'char_002_amiya': '阿米娅',
    'char_003_kalts': '凯尔希',
    'char_123_fang': '芬',
    'char_124_kroos': '克洛丝',
    'char_128_plosis': '白面鸮',
    'char_150_snakek': '蛇屠箱',
    'char_151_myrtle': '桃金娘',
    'char_180_amgoat': '艾雅法拉',
    'char_196_sunbr': '古米',
    'char_202_demkni': '塞雷娅',
    'char_206_gnosis': '灵知',
    'char_245_cello': '塑心',
    'char_284_spot': '斑点',
    'char_293_thorns': '棘刺',
    'char_350_surtr': '史尔特尔',
    'char_377_gdglow': '澄闪',
    'char_449_glider': '蜜莓',
    'char_472_pasngr': '异客',
    'char_497_ctable': '晓歌',
    'char_1016_agoat2': '纯烬艾雅法拉',
    'char_1012_skadi2': '浊心斯卡蒂',
    'char_1013_chen2': '假日威龙陈',
    'char_1020_reed2': '焰影苇草',
    'char_1023_ghost2': '归溟幽灵鲨',
    'char_1026_gvial2': '百炼嘉维尔',
    'char_1028_texas2': '缄默德克萨斯',
    'char_1029_yato2': '麒麟R夜刀',
    'char_1035_wisdel': '维什戴尔',
    'char_2012_typhon': '提丰',
    'char_2023_ling': '令',
    'char_2025_shu': '黍',
    'char_4039_horn': '号角',
    'char_4055_bgsnow': '鸿雪',
    'char_4064_mlynar': '玛恩纳',
    'char_4087_ines': '伊内丝',
    'char_4116_blkkgt': '锏',
    'char_4117_ray': '莱伊',
    'char_4123_ela': '艾拉',
    'char_4133_logos': '逻各斯',
    'char_4145_ulpia': '乌尔比安',
    'char_4146_nymph': '妮芙',
    'char_4151_tinman': '锡人',
}

const TOOL_NAMES_3 = {
    "209": '支援补给站',
    "210": '支援地雷组',
    "211": '支援轰隆隆',
}
const TOOL_NAMES_4 = {
    'rogue_3_active_tool_1': '支援补给站',
    'rogue_3_active_tool_3': '支援轰隆隆',
    'rogue_3_active_tool_5': '支援防暴桩',
}

const RELIC_NAMES_3 = {
    "110": '绿叶菜罐头',
    "118": '药枚',
    "180": '地形图',
    "199": '御2',
    "207": '投币玩具',
}
const RELIC_NAMES_4 = {
    'rogue_3_relic_fight_19': '岩角号',
    'rogue_3_relic_legacy_30': '热水壶',
    'rogue_3_relic_fight_21': '湖中神盾',
    'rogue_3_relic_legacy_21': '蓝色丝巾', 
    'rogue_3_relic_res_6': '《重型音乐选集》',
}

const CHAOS_NAMES = {
    "rogue_3_chaos_1": '去量化',
    "rogue_3_chaos_2": '实质性坍缩',
    "rogue_3_chaos_3": '非线性移动',
    "rogue_3_chaos_4": '情绪实体',
    "rogue_3_chaos_5": '泛社会悖论',
}

const TOTEM_NAMES = {
    'rogue_3_totem_R_L3': '战士',
    'rogue_3_totem_R_E1': '歌唱',
}

const EVENTS = {
    1727424000: '矢量突破开启',
    1727726400: '2024-10月度小队更新',
    1728460800: '追迹日落以西开启',
    1729670400: '内容拓展Ⅰ：遁入阇那',
    1730404800: '2014-11月度小队更新',
    1730448000: '揭幕者们开启',
    1731657600: '卫戍协议开启',
    1732996800: '2024-12月度小队更新',
    1733385600: '出苍白海开启',
    1734163200: '仙术杯#6淘汰赛',
    1735286400: '仙术杯#6决赛',
    1735675200: '2025-01月度小队更新',
    1735459200: '视相博物馆开启',
    1736409600: '内容拓展Ⅱ：无瑕之日',
    // [0, 1727726400, '月度小队更新'],
    // [1, 1730404800, '月度小队更新'],
    // [2, 1732996800, '月度小队更新'],
    // [3, 1735675200, '月度小队更新'],
    // { timestamp: 1727726400, text: '月度小队更新' },
    // { timestamp: 1730404800, text: '月度小队更新' },
    // { timestamp: 1732996800, text: '月度小队更新' },
    // { timestamp: 1735675200, text: '月度小队更新' },
}


// Vue 3
const { createApp } = Vue;
const app = createApp({
    el: '#app',
    data: () => ({
        datetime_str_options: {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
        },
        date_str_options: {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour12: false,
        },
        time_str_options: {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
        },
        group_id: '',
        player_info_str: '',
        display_mode: 'default',
        display_mode_names: {'default': '默认', 'daily': '每天最后一次更新', 'all': '每一次更新'},
        operator_names: OPERATOR_NAMES,
        tool_names_3: TOOL_NAMES_3,
        tool_names_4: TOOL_NAMES_4,
        relic_names_3: RELIC_NAMES_3,
        relic_names_4: RELIC_NAMES_4,
        chaos_names: CHAOS_NAMES,
        totem_names: TOTEM_NAMES,
        event_list: [],
        day_offset: 3,
        interval: 20,
        last_update_timestamp: 0,
        last_update_fixed: true,
        table_ji_stats_height: 'auto',
        ji_stats_index_list: [],
        ji_stats_data: {},
        latest_data: {rogue_2: '', rogue_3: '', rogue_4: '', rogue_5: ''},
        colorList: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        isLoading: true,
        selectingTab: 'rogue_5',
        active_collapse_name_list: [],
    }),
    mounted() {
        this.selectingTab = 'rogue_5';

        this.chart_2_endings = echarts.init(document.getElementById('div_chart_2_endings'));

        this.chart_3_endings = echarts.init(document.getElementById('div_chart_3_endings'));
        this.chart_3_dice = echarts.init(document.getElementById('div_chart_3_dice'));
        this.chart_3_coin = echarts.init(document.getElementById('div_chart_3_coin'));

        this.chart_4_endings = echarts.init(document.getElementById('div_chart_4_endings'));
        this.chart_4_vision = echarts.init(document.getElementById('div_chart_4_vision'));
        this.chart_4_game = echarts.init(document.getElementById('div_chart_4_game'));
        this.chart_4_spring = echarts.init(document.getElementById('div_chart_4_spring'));
        this.chart_4_height = echarts.init(document.getElementById('div_chart_4_height'));

        this.chart_5_endings = echarts.init(document.getElementById('div_chart_5_endings'));
        this.chart_5_alchemy = echarts.init(document.getElementById('div_chart_5_alchemy'));
        this.chart_5_amiya = echarts.init(document.getElementById('div_chart_5_amiya'));
        this.chart_5_persuade = echarts.init(document.getElementById('div_chart_5_persuade'));
        this.chart_5_gold_save = echarts.init(document.getElementById('div_chart_5_gold_save'));
        this.chart_5_temp_upgrade = echarts.init(document.getElementById('div_chart_5_temp_upgrade'));

        this.charts = {
            'rogue_2': {
                'endings': this.chart_2_endings,
            },
            'rogue_3': {
                'endings': this.chart_3_endings,
                'dice': this.chart_3_dice,
                'coin': this.chart_3_coin,
            },
            'rogue_4': {
                'endings': this.chart_4_endings,
                'vision': this.chart_4_vision,
                'game': this.chart_4_game, 
                'spring': this.chart_4_spring,
                'height': this.chart_4_height,
            },
            'rogue_5': {
                'endings': this.chart_5_endings,
                'alchemy': this.chart_5_alchemy,
                'amiya': this.chart_5_amiya,
                'persuade': this.chart_5_persuade,
                'goldSave': this.chart_5_gold_save,
                'tempUpgrade': this.chart_5_temp_upgrade,
            },
        }

        let event_idx = 0;
        for (let timestamp in EVENTS) {
            this.event_list.push([timestamp, event_idx++]);
        }

        

        this.load_login_data();
        this.fetchData();
        setTimeout(this.resizeAll, 100);
        window.addEventListener('resize', this.resizeAll);
    },
    watch: {
        selectingTab: function() {
            this.init();
            setTimeout(this.resizeAll, 100);
        },
        display_mode: function() {
            this.init();
            setTimeout(this.resizeAll, 100);
        },
        day_offset: function() {
            this.init();
            setTimeout(this.resizeAll, 100);
        },
        interval: function() {
            this.init();
            setTimeout(this.resizeAll, 100);
        },
    },

    methods: {
        // tools function
        sum: (iterable) => {
            let sum = 0;
            iterable.forEach(v => sum += v);
            return sum;
        },
        formatTo2: (num) => { return (num >= 10) ?  num.toString() : '0' + num.toString() },

        load_login_data() {
            if (!window.localStorage) {
                console.error('浏览器不支持localStorage');
            }
            else {
                console.log('加载登录信息');
                if (!('login_token' in window.localStorage) || !('login_user_id' in window.localStorage)) {
                    console.log('没有找到已保存的登录信息');
                    return false;
                }
                this.login_user_id = window.localStorage['login_user_id'];
                this.login_token = window.localStorage['login_token'];
                return true;
            }
        },

        fetchData: function() {
            const that = this;
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            ElementPlus.ElMessage('正在请求数据');
            let start = new Date()
            let payload = {
                'type_name': 'server',
                'group_id': this.group_id || '',
                'user_id': this.login_user_id || '',
                'login_token': this.login_token || '',
            }
            axios.post('https://yubo.run/api/arknights/get_ji_stats', payload).then(res => {
                if (res.data.code != 0) {
                    that.$alert(res.data.message, '获取记录失败');
                    // that.isLoading = false;
                    if (res.data.go_to_home) {
                        setTimeout(this.goto_user_home, 3000);
                    }
                    return;
                }
                ElementPlus.ElMessage({
                    message: `请求数据完成，用时${+new Date() - start}ms`,
                    type: 'success',
                });
                that.ji_stats_data = res.data;
                that.init();
            }).catch(function (error) {
                that.$alert(error, '获取数据失败，请联系维护人员');
                that.isLoading = false;
                console.error(error);
                console.error(error.stack);
            });
        },

        goto_user_home: function() {
            window.location.href = `https://yubo.run/user/`;
        },

        get_datetime_str_28: function(date) {
            let hour = date.getHours();
            let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let date_str = date.toLocaleString('chinese', { timeZone: tz, ...this.date_str_options }).split('/').join('-');
            let time_str = date.toLocaleString('chinese', { timeZone: tz, ...this.time_str_options });
            // if (16 * 3600 <= +date && +date < 20 * 3600) {
            if (16 * 3600 * 1000 <= (+date % (24 * 3600 * 1000)) && (+date % (24 * 3600 * 1000)) < 20 * 3600 * 1000) {
                date = new Date(date - 24 * 3600 * 1000);
                date_str = date.toLocaleString('chinese', { timeZone: tz, ...this.date_str_options }).split('/').join('-');
                time_str = 24 + hour + time_str.slice(2, 8);
            }
            return `${date_str} ${time_str}`;
        },

        getMonday: function(d) {
            d = new Date(d);
            var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        },

        init: function() {
            console.time('init');
            this.isLoading = true;
            this.init_latest_data();
            if (this.selectingTab === 'rogue_2') {
                this.init_charts(this.selectingTab);
            }
            else if (this.selectingTab === 'rogue_3') {
                this.init_charts(this.selectingTab);
            }
            else if (this.selectingTab === 'rogue_4') {
                this.init_charts(this.selectingTab);
            }
            else if (this.selectingTab === 'rogue_5'){
                this.init_charts(this.selectingTab);
            }
            this.isLoading = false;
            console.timeEnd('init');
        },

        init_latest_data: function() {
            for (let rogue_id in this.charts) {
                let latest_day_str = Object.keys(this.ji_stats_data[rogue_id]).slice(-1)[0];
                let latest_timestamp = Object.keys(this.ji_stats_data[rogue_id][latest_day_str]).slice(-1)[0];
                this.latest_data[rogue_id] = this.ji_stats_data[rogue_id][latest_day_str][latest_timestamp];
            }
        },

        init_charts: function(rogue_id) {
            for (let chart_name in this.charts[rogue_id]) {
                if (chart_name == 'endings') {
                    this.init_chart_stacked_area_endings(rogue_id, 'endings');
                }
                else {
                    this.init_chart_line(rogue_id, chart_name);
                }
            }
        },

        init_chart_line: function(rogue_id, chart_name) {
            let today = new Date();
            today.setTime(+today - 4 * 60 * 60 * 1000);
            let today_str = this.get_datetime_str_28(today);
            let data_list = [];
            let x_axis_list = [];
            let date_list = Object.keys(this.ji_stats_data[rogue_id]);
            for (let i = 0; i < date_list.length; i++) {
                let timestamp_delta;
                let timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                if (this.display_mode == 'default') {
                    if (i < date_list.length - this.day_offset) {
                        timestamp_delta = +new Date();
                        timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]).slice(-1);
                    }
                    else {
                        timestamp_delta = this.day_offset * 24 * 60 * 60 * 1000 + 40 * 60 * 1000;
                        // timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                        let full_timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                        timestamp_list = [];
                        let timestamp_set = new Set();
                        for (let j = 0; j < full_timestamp_list.length; j++) {
                            let timestamp = +full_timestamp_list[j];
                            let timestamp_of_interval = Math.floor(timestamp / (60 * this.interval)) * 60 * this.interval;
                            if (!(timestamp_set.has(timestamp_of_interval))) {
                                timestamp_list.push(full_timestamp_list[j]);
                                timestamp_set.add(timestamp_of_interval);
                            }
                        }
                    }
                }
                else if (this.display_mode == 'daily') {
                    timestamp_delta = +new Date();
                    timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]).slice(-1);
                }
                else if (this.display_mode == 'all') {
                    timestamp_delta = +new Date();
                    timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                }
                for (let j = 0; j < timestamp_list.length; j++) {
                    // console.log(date_list[i], j, +new Date(), timestamp_list[j] * 1000, timestamp_delta, +new Date() - timestamp_list[j] * 1000 < timestamp_delta)
                    if (+new Date() - timestamp_list[j] * 1000 < timestamp_delta) {
                        // data_list.push(this.ji_stats_data[rogue_id][date_list[i]][timestamp_list[j]][chart_name]);
                        data_list.push([new Date(timestamp_list[j] * 1000), this.ji_stats_data[rogue_id][date_list[i]][timestamp_list[j]][chart_name]]);
                        x_axis_list.push(this.get_datetime_str_28(new Date(this.ji_stats_data[rogue_id][date_list[i]][timestamp_list[j]]['last_update_timestamp'] * 1000)));
                    }
                }
            }
            // let delta_list = [0];
            let delta_list = [[undefined, 0]];
            let max_delta = 0;
            for (let i = 1; i < data_list.length; i++) {
                // delta_list.push(data_list[i] - data_list[i - 1]);
                delta_list.push([data_list[i][0], data_list[i][1] - data_list[i - 1][1]]);
                if (data_list[i][1] - data_list[i - 1][1] > max_delta) {
                    max_delta = data_list[i][1] - data_list[i - 1][1];
                }
            }
            // let offset_28 = (24 + new Date().getHours() + (new Date().getTimezoneOffset() / 60)) % 24;
            // offset_28 = (16 <= offset_28 && offset_28 < 20) ? 0 : 1;
            // let start_date = new Date(new Date() - (this.day_offset + offset_28) * 24 * 60 * 60 * 1000).setHours(20 - (new Date().getTimezoneOffset() / 60), 0, 0);

            // offset_28: 是否已进入泰拉历新的一天(day n+1)而UTC仍在原来的一天(day n)
            // 20: 泰拉历与UTC之间的时差为4小时，泰拉历0时=UTC前一天20时
            let offset_28 = ((+new Date()) % 86400000) / (60 * 60 * 1000) > 20 ? 1 : 0;
            // Math.ceil((+new Date()) / 86400000 + offset_28): 泰拉历天数（一天的结束）
            // - 4 * 3600000: 泰拉历与UTC之间的时差
            // this.day_offset * 86400000: 要展示的天数
            let start_date = new Date(Math.ceil((+new Date()) / 86400000 + offset_28) * 86400000 - 4 * 3600000 - this.day_offset * 86400000);

            var option = {
                title: {
                    // top: 30,
                    left: 'center',
                    text: `全服集集统计 ${ROGUE_NAMES[rogue_id]}`
                },
                grid: {
                    height: '70%',
                    top: '15%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: true },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    top: 30,
                    data: [`${CHART_NAMES[chart_name]}`, '比上一个时间点增加了', '事件'],
                    selected: {
                        '事件': false,
                    },
                },
                xAxis: [
                    {
                        // type: 'category',
                        type: 'time',
                        // data: x_axis_list,
                        axisLabel: {
                            formatter: '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}',
                        },
                        axisPointer: {
                            type: 'shadow',
                            formatter: '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}',
                        },
                        splitArea: {
                            show: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: `${CHART_NAMES[chart_name]}`,
                        min: 'dataMin',
                        // max: 'dataMax',
                        // interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: `比上一个时间点增加了`,
                        // min: 'dataMin',
                        // max: 'dataMax',
                        // interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    // {
                    //     name: '事件',
                    //     max: 1.2,
                    //     show: false,
                    // },
                ],
                dataZoom: [
                    {
                        type: 'slider',
                        bottom: '2%',
                        xAxisIndex: [0],
                        filterMode: 'filter',
                        // start: 0,
                        // 20: 24 - 4（泰拉时间），(new Date().getTimezoneOffset() / -60): 本地时区
                        startValue: this.display_mode == 'default' ? start_date: new Date(0),
                        // end: 100
                    },
                ],
                series: [
                    {
                        name: `${CHART_NAMES[chart_name]}`,
                        type: 'line',
                        yAxisIndex: 0,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: data_list,
                    },
                    {
                        name: `比上一个时间点增加了`,
                        type: 'bar',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: delta_list,
                    },
                    {
                        name: `事件`,
                        type: 'line',
                        stack: 'all',
                        yAxisIndex: 1,
                        symbolSize: 6,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (object) {
                                return EVENTS[object.value[0] / 1000];
                            }
                        },
                        data: this.event_list.map(x => [x[0] * 1000, max_delta * (0.9 - 0.2 * (x[1] % 3))]),
                    },
                ]
            };

            this.charts[rogue_id][chart_name] && this.charts[rogue_id][chart_name].setOption(option);
        },

        init_chart_stacked_area_endings: function(rogue_id) {
            let chart_name = 'endings';
            let today = new Date();
            today.setTime(+today - 4 * 60 * 60 * 1000);
            let today_str = this.get_datetime_str_28(today);
            let ending_lists = {'1': [], '2': [], '3': [], '4': [], '5': []};
            let x_axis_list = [];
            let date_list = Object.keys(this.ji_stats_data[rogue_id]);
            for (let i = 0; i < date_list.length; i++) {
                let timestamp_delta;
                let timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                if (this.display_mode == 'default') {
                    if (i < date_list.length - this.day_offset) {
                        timestamp_delta = +new Date();
                        timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]).slice(-1);
                    }
                    else {
                        timestamp_delta = this.day_offset * 24 * 60 * 60 * 1000 + 40 * 60 * 1000;
                        // timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                        let full_timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                        timestamp_list = [];
                        let timestamp_set = new Set();
                        for (let j = 0; j < full_timestamp_list.length; j++) {
                            let timestamp = +full_timestamp_list[j];
                            let timestamp_of_interval = Math.floor(timestamp / (60 * this.interval)) * 60 * this.interval;
                            if (!(timestamp_set.has(timestamp_of_interval))) {
                                timestamp_list.push(full_timestamp_list[j]);
                                timestamp_set.add(timestamp_of_interval);
                            }
                        }
                    }
                }
                else if (this.display_mode == 'daily') {
                    timestamp_delta = +new Date();
                    timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]).slice(-1);
                }
                else if (this.display_mode == 'all') {
                    timestamp_delta = +new Date();
                    timestamp_list = Object.keys(this.ji_stats_data[rogue_id][date_list[i]]);
                }
                for (let j = 0; j < timestamp_list.length; j++) {
                    if (+new Date() - timestamp_list[j] * 1000 < timestamp_delta) {
                        for (let ending_count in ending_lists) {
                            // ending_lists[ending_count].push(this.ji_stats_data[rogue_id][date_list[i]][timestamp_list[j]][chart_name][ending_count] || '-');
                            ending_lists[ending_count].push([new Date(timestamp_list[j] * 1000), this.ji_stats_data[rogue_id][date_list[i]][timestamp_list[j]][chart_name][ending_count] || '-']);
                        }
                        x_axis_list.push(this.get_datetime_str_28(new Date(this.ji_stats_data[rogue_id][date_list[i]][timestamp_list[j]]['last_update_timestamp'] * 1000)));
                    }
                }
            }

            // offset_28: 是否已进入泰拉历新的一天(day n+1)而UTC仍在原来的一天(day n)
            // 20: 泰拉历与UTC之间的时差为4小时，泰拉历0时=UTC前一天20时
            let offset_28 = ((+new Date()) % 86400000) / (60 * 60 * 1000) > 20 ? 1 : 0;
            // Math.ceil((+new Date()) / 86400000 + offset_28): 泰拉历天数（一天的结束）
            // - 4 * 3600000: 泰拉历与UTC之间的时差
            // this.day_offset * 86400000: 要展示的天数
            let start_date = new Date(Math.ceil((+new Date()) / 86400000 + offset_28) * 86400000 - 4 * 3600000 - this.day_offset * 86400000);

            var option = {
                title: {
                    left: 'center',
                    text: `全服集集统计 ${ROGUE_NAMES[rogue_id]}`
                },
                grid: {
                    height: '70%',
                    top: '15%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    top: 30,
                    data: [`${CHART_NAMES[chart_name]}`]
                },
                xAxis: [
                    {
                        // type: 'category',
                        type: 'time',
                        // data: x_axis_list,
                        axisLabel: {
                            formatter: '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}',
                        },
                        axisPointer: {
                            type: 'shadow',
                            formatter: '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}',
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: `${CHART_NAMES[chart_name]}`,
                        // min: 'dataMin',
                        // max: 'dataMax',
                        // interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                ],
                dataZoom: [
                    {
                        type: 'slider',
                        bottom: '2%',
                        xAxisIndex: [0],
                        filterMode: 'filter',
                        // start: 0,
                        // 20: 24 - 4（泰拉时间），(new Date().getTimezoneOffset() / -60): 本地时区
                        startValue: this.display_mode == 'default' ? start_date: new Date(0),
                        // end: 100
                    },
                ],
                series: [
                    {
                        name: `通关一个结局`,
                        stack: 'Total',
                        type: 'line',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                                // return `${value}%`;
                                return `${value}`;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: ending_lists['1'],
                    },
                    {
                        name: `通关两个结局`,
                        stack: 'Total',
                        type: 'line',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                                // return `${value}%`;
                                return `${value}`;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: ending_lists['2'],
                    },
                    {
                        name: `通关三个结局`,
                        stack: 'Total',
                        type: 'line',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                                // return `${value}%`;
                                return `${value}`;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: ending_lists['3'],
                    },
                    {
                        name: `通关四个结局`,
                        stack: 'Total',
                        type: 'line',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                                // return `${value}%`;
                                return `${value}`;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: ending_lists['4'],
                    },
                    {
                        name: `通关五个结局`,
                        stack: 'Total',
                        type: 'line',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        tooltip: {
                            valueFormatter: function (value) {
                                // return `${value}%`;
                                return `${value}`;
                            }
                        },
                        label: {
                            // show: true,
                            position: 'inside'
                        },
                        data: ending_lists['5'],
                    },
                ]
            };

            this.charts[rogue_id][chart_name] && this.charts[rogue_id][chart_name].setOption(option);
        },

        set_display_mode: function(mode_index) {
            this.display_mode = Object.keys(this.display_mode_names)[mode_index];
        },

        set_day_offset: function(day_offset) {
            this.day_offset = day_offset;
        },

        set_interval: function(interval) {
            this.interval = interval;
        },

        resizeAll: function() {
            console.time('resizeAll');
            for (let rogue_id in this.charts) {
                for (let i in this.charts[rogue_id]) {
                    this.charts[rogue_id][i] && this.charts[rogue_id][i].resize();
                }
            }
            console.timeEnd('resizeAll');
        },
    },
    // delimiters: ['[[', ']]'],
})

// Vue 3
app.use(ElementPlus);
app.mount('#app');
