// 菜单 侧边栏
export default [
    { path: '/index', title: '首页', icon: 'home' },
    {
        title: '采购管理',
        icon: 'folder-o',
        children: [
            { path: '/pur_list', title: '收货列表' }
        ]
    },
    {
        title: '物料管理',
        icon: 'folder-o',
        children: [
            { path: '/material_list', title: '物料列表' },
            { path: '/material_list_parent', title: '物料汇总列表' }
        ]
    },
    {
        title: '出库管理',
        icon: 'folder-o',
        children: [
            { path: '/outbound_list', title: '出库列表' },
            { path: '/outbound_report', title: '工作日志报表' }
        ]
    },
    {
        title: '任务管理',
        icon: 'folder-o',
        children: [
            { path: '/task_list', title: '任务列表' },
            { path: '/task_report', title: '统计报表' }
        ]
    },
    {
        title: '系统管理',
        icon: 'folder-o',
        children: [
            { path: '/system_user', title: '用户列表' },
            // { path: '/system_role', title: '角色列表' },
            { path: '/system_dictionary', title: '字典列表' }
        ]
    }
]