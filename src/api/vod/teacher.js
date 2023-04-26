//引入封装好的ajax请求
import request from '@/utils/request'

//常量
const api_name = '/admin/vod/teacher'
//export 模块话开发
export default {
    //讲师条件查询分页
    //current 当前页 limit每页记录数 searchObj条件对象
    pageList(current,limit,searchObj) {
        return request({
            //url: '/admin/vod/teacher/findQueryPage/{current}/{limit}', 第一种方式 字符串拼接
            url: `${api_name}/findQueryPage/${current}/${limit}`, //使用第二种模板字符串
            method: 'post',
            //使用json格式传递 写法 data:searchObj
            //使用普通格式传递 写法 params:searchObj
            data:searchObj
          })
    },
    //讲师的删除接口
    removeTeacherId(id) {
        return request({
            //url: '/admin/vod/teacher/findQueryPage/{current}/{limit}', 第一种方式 字符串拼接
            url: `${api_name}/remove/${id}`, //使用第二种模板字符串
            method: 'delete'
          })
    },
    //讲师添加
    saveTeacher(teacher) {
        return request({
          url: `${api_name}/saveTeacher`,
          method: `post`,
          data: teacher
        })
    },
    //根据id查询
    getTeacherById(id) {
        return request({
            url: `${api_name}/getTeacher/${id}`, //使用第二种模板字符串
            method: 'get'
        })
    },
    //讲师修改
    updateTeacher(teacher) {
        return request({
          url: `${api_name}/updateTeacher`,
          method: `post`,
          data: teacher
        })
    },
    //批量删除
    batchRemove(idList) {
        return request({
          url: `${api_name}/removeBatch`,
          method: `delete`,
          data: idList
        })
    },
}


