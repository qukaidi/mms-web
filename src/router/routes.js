import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [{
    path: '/',
    redirect: {
        name: 'index'
    },
    component: layoutHeaderAside,
    children: [{
            path: 'index',
            name: 'index',
            meta: {
                auth: true
            },
            component: _import('system/index')
        },
        {
            path: 'pur_list',
            name: 'purList',
            meta: {
                title: '收货列表',
                auth: true
            },
            component: _import('demo/purchase/list')
        }, {
            path: 'pur_add',
            name: 'purAdd',
            meta: {
                title: '新建采购单',
                auth: true
            },
            component: _import('demo/purchase/add')
        },
        {
            path: 'material_list',
            name: 'materialList',
            meta: {
                title: '物料列表',
                auth: true
            },
            component: _import('demo/material/list')
        }, {
            path: 'material_add',
            name: 'materialAdd',
            meta: {
                title: '新增材料界面',
                auth: true
            },
            component: _import('demo/material/add')
        },
        {
            path: 'material_list_parent',
            name: 'materialList',
            meta: {
                title: '物料汇总列表',
                auth: true
            },
            component: _import('demo/material/list_parent')
        },
        {
            path: 'outbound_list',
            name: 'outboundList',
            meta: {
                title: '出库列表',
                auth: true
            },
            component: _import('demo/outbound/list')
        },
        {
            path: 'outbound_add',
            name: 'outboundAdd',
            meta: {
                title: '工作日志界面',
                auth: true
            },
            component: _import('demo/outbound/add')
        },
        {
            path: 'outbound_report',
            name: 'outboundReport',
            meta: {
                title: '工作日志报表',
                auth: true
            },
            component: _import('demo/outbound/report')
        },
        {
            path: 'task_list',
            name: 'taskList',
            meta: {
                title: '任务列表',
                auth: true
            },
            component: _import('demo/task/list')
        }, {
            path: 'task_add',
            name: 'taskAdd',
            meta: {
                title: '任务界面',
                auth: true
            },
            component: _import('demo/task/add')
        },
        {
            path: 'task_report',
            name: 'taskReport',
            meta: {
                title: '统计报表',
                auth: true
            },
            component: _import('demo/task/report')
        },
        {
            path: 'system_user',
            name: 'systemUser',
            meta: {
                title: '用户列表',
                auth: true
            },
            component: _import('demo/system/user')
        },
        // {
        //     path: 'system-role',
        //     name: 'system-role',
        //     meta: {
        //         title: '角色列表',
        //         auth: true
        //     },
        //     component: _import('demo/system/role')
        // },
        {
            path: 'system_dictionary',
            name: 'systemDictionary',
            meta: {
                title: '字典列表',
                auth: true
            },
            component: _import('demo/system/dictionary')
        },
        // 系统 前端日志
        {
            path: 'log',
            name: 'log',
            meta: {
                title: '前端日志',
                auth: true
            },
            component: _import('system/log')
        },
        // 刷新页面 必须保留
        {
            path: 'refresh',
            name: 'refresh',
            hidden: true,
            component: _import('system/function/refresh')
        },
        // 页面重定向 必须保留
        {
            path: 'redirect/:route*',
            name: 'redirect',
            hidden: true,
            component: _import('system/function/redirect')
        }
    ]
}]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: _import('system/login')
    }
]

/**
 * 错误页面
 */
const errorPage = [{
    path: '*',
    name: '404',
    component: _import('system/error/404')
}]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]