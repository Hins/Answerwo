<?php
class application_common_constant{
    const COOKIE_USER_NAME = 'answerwo_name';
    const COOKIE_USER_UNIQUE = 'answerwo_unique';
    const COOKIE_USER_UNIQUE_PREFIX = 'answer#';
    const COOKIE_USER_LOGIN_STATUS = 'answerwo_status';
    const COOKIE_USER_AUTO_LOGIN = 'answerwo_auto';
    const COOKIE_USER_UNIQUE_EXPIRE_SECONDS = 86400;//用户唯一标识码有效期:一个月
    const COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS = 2592000; //用户自动登录保留期限：一个月
    const COOKIE_DOMAIN = 'prepublish.answerwo.com';
    const COOKIE_USER_SEARCH_RECORD = 'answerwo_search_record';//用户搜索记录
    const COOKIE_USER_SEARCH_RECORD_LIMIT = 10;//用户搜索记录条数

    const KNOWLEDGE_AUDIT_TYPE_ADD = 1;//审核知识点：添加
    const KNOWLEDGE_AUDIT_TYPE_DEL = 2;//审核知识点：删除

    const QUESTION_LIST_CONTENT_LENGTH = 168; //题目列表页题目内容截取长度（这里表示这么多个汉字的宽度，英文字母为了保持与这些汉字同样的宽度，会截取更多的字符）
    const QUESTION_SIMILAR_KEY_LENGTH = 20; //相似题目截取的题目关键词的长度

    const WEBSIT_INDEX = "http://prepublish.answerwo.com"; //网站首页
    const WEBSIT_DOMAIN = "answerwo.com"; //域
    //const IMG_INDEX = "http://img.zhaotimu.com"; //图片服务器域名

    const SEARCH_LIMIT_PER_PAGE = 20;//搜索每次结果数

    //缓存的key
    //各科目按照知识点分组统计题目个数
    const CACHE_KEY_SUBJECT_KNOWLEDGE_QUESTION_COUNT = 'CACHE_KEY_SUBJECT_KNOWLEDGE_QUESTION_COUNT';
    //各科目按照知识点家族关系统计题目个数
    const CACHE_KEY_SUBJECT_KNOWLEDGE_FAMILY_QUESTION_COUNT = 'CACHE_KEY_SUBJECT_KNOWLEDGE_FAMILY_QUESTION_COUNT';
    //各科目按照难度分组统计题目个数
    const CACHE_KEY_SUBJECT_LEVEL_QUESTION_COUNT = 'CACHE_KEY_SUBJECT_LEVEL_QUESTION_COUNT';
    //各科目按照来源类型分组统计题目个数
    const CACHE_KEY_SUBJECT_SOURCE_TYPE_QUESTION_COUNT = 'CACHE_KEY_SUBJECT_SOURCE_TYPE_QUESTION_COUNT';
    //各科目按照题目类型分组统计题目个数
    const CACHE_KEY_SUBJECT_QUESTION_TYPE_QUESTION_COUNT = 'CACHE_KEY_SUBJECT_QUESTION_TYPE_QUESTION_COUNT';
    //各科目题目数量
    const CACHE_KEY_SUBJECT_QUESTION_COUNT = 'CACHE_KEY_SUBJECT_QUESTION_COUNT';
    //行政区id到名称映射表
    const CACHE_KEY_REGION_ID2NAME_MAP = 'CACHE_KEY_REGION_ID2NAME_MAP';

    //题目贡献
    const CONTRIBUTION_TYPE_CREATE_QUESTION = 1; //创建题目
    const CONTRIBUTION_TYPE_REPORT_QUESTION_ERROR = 2; //报错
    const CONTRIBUTION_TYPE_MODIFY_QUESTION_KNOWLEDGE = 3; //修改题目
    const CONTRIBUTION_TYPE_EDIT_QUESTION_EXPLAINS = 4; //解析
    const CONTRIBUTION_TYPE_REMARK = 5; //发表讨论

    //用户设置（user_setting）类型
    const USER_SETTING_SUBJECT_FOCUS_ON = 1; //用户关注的科目
    const USER_SETTING_GRADE_FOUCE_ON = 2;//用户关注的年级
    const USER_SETTING_EMAIL_NOTICE = 3; //用户的邮件通知策略
    
    //注册用户角色类型
    const REGISTER_USER_ROLE_OTHER = 0; //其他
    const REGISTER_USER_ROLE_TEACHER = 1; //老师
    const REGISTER_USER_ROLE_STUDENT = 2;//学生
    const REGISTER_USER_ROLE_PARENT = 3; //家长

    //用户类型
    const REGISTER_USER_TYPE_COMMON = 0; //普通用户
    const REGISTER_USER_TYPE_CREDIBLE = 1; //可信用户
    const REGISTER_USER_TYPE_SLAVE = 8; //僵尸用户
    const REGISTER_USER_TYPE_FORBIDDEN = 9; //封禁用户

    //注册用户性别
    const REGISTER_USER_GENDER_MALE = 1; //男
    const REGISTER_USER_GENDER_FEMALE = 2; //女
    const REGISTER_USER_GENDER_UNKNOW = 0; //未知

    //审核状态
    const AUDIT_STATUS_WATING = 0; //未审核
    const AUDIT_STATUS_UNPASS = 1; //审核未通过
    const AUDIT_STATUS_PASS = 2; //审核通过

    //解析历史版本状态
    const EXPLAIN_VERSION_STATUS_WAITING = 0; //未设置
    const EXPLAIN_VERSION_STATUS_DELETE = 1; //已删除版本
    const EXPLAIN_VERSION_STATUS_HISTORY = 2; //历史版本
    const EXPLAIN_VERSION_STATUS_CURRENT = 3; //当前版本

    //管理状态
    const ADMIN_STATUS_WATING = 0; //未处理
    const ADMIN_STATUS_DONE = 1; //已处理

    //分享类型
    const SHEET_SHARE_OPEN = 0; //完全公开
    const SHEET_SHARE_PASSWORD = 1; //使用密码访问
    const SHEET_SHARE_CLOSED = 2; //不公开

    //僵尸账号专用密码和邮箱
    const SLAVE_USER_PASSWORD = "cmbjxCCWTN";
    const SLAVE_USER_EMAIL = "slave@yingheyoushi.com";

    //行政区等级
    const REGION_LEVEL_PROVINCE = 1;
    const REGION_LEVEL_CITY = 2;
    const REGION_LEVEL_AREA = 3;
    const REGION_LEVEL_SCHOOL = 4;

    //顶级行政区
    const REGION_COUNTRY_CHINA = 0; //中国

    //第三方网站名称
    const CONNECT_SITE_QQ = 'qq';
    const CONNECT_SITE_SINAWEIBO = 'sinaweibo';
    const CONNECT_SITE_RENREN = 'renren';
    
}
?>

