let link_banner_basic = '<hr>[ ' +
                  '<a href="/index">回首頁</a>' + '．' +
                  // '<a href="/horizontal_give">同事互評</a>' + '．' +
                  '<a href="/upward_give">向上回饋</a>' + '．' +
                  '<a href="/comment">評語</a>' + ' ]';
let link_banner_leader = '[ ' +
                  '<a href="/upward_fullresult">向上回饋評分結果</a>' + ' ]';
let link_banner_admin = '[ ' +
                  // '<a href="/horizontal_rawdata">同事互評排行榜</a>' + '．' +
                  // '<a href="/upward_rawdata">向上回饋排行榜</a>' + '．' +
                  '<a href="/upward_result">向上回饋評分管理</a>' + '．' +
                  '<a href="/account_manage">帳戶管理</a>' + ' ]';
let link_banner_logout = '[ ' + '<a href="/logout">登出</a>' + ' ]'
let link_banner = {'basic': link_banner_basic,
                   'leader': link_banner_leader,
                   'admin': link_banner_admin,
                   'logout': link_banner_logout};

const nothing_grade_value = 99;

let horizontal_grade_value = [-3,-1,0,1,3];
let horizontal_grade_item = ['刻意逃避 / 忽略 / 拒絕',
                             '沒有幫忙 / 敷衍',
                             '無法協助',
                             '有提供協助或意見',
                             '主動熱心積極'];

let upward_grade_value = [nothing_grade_value,-3,-1,0,1,3];
let upward_grade_item = ['沒有交集 / 不予評分',
                         '沒有做到 / 令人失望',
                         '不太好',
                         '普通 / 不好不壞',
                         '還不錯',
                         '做得很棒'];
// let upward_grade_item = ['沒有做到 / 令人失望',
//                          '沒有交集',
//                          '勉強還可以',
//                          '還不錯',
//                          '做得很棒'];

let session_timeout = 3600000; // in ms

exports.link_banner = link_banner;
exports.nothing_grade_value = nothing_grade_value;
exports.horizontal_grade_value = horizontal_grade_value;
exports.horizontal_grade_item = horizontal_grade_item;
exports.upward_grade_value = upward_grade_value;
exports.upward_grade_item = upward_grade_item;
exports.session_timeout = session_timeout;
