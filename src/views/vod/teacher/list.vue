<template>
  <div class="app-container">
    讲师列表

    <!--查询表单-->
    <el-card class="operate-container" shadow="never">
        <!-- el-form 是一个表单 inline 表示在一行显示-->
        <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="名称">
            <el-input v-model="searchObj.name" placeholder="讲师名" /> 
        </el-form-item>

        <el-form-item label="头衔">
            <el-select v-model="searchObj.level" clearable placeholder="头衔">
            <el-option value="1" label="高级讲师"/>
            <el-option value="0" label="首席讲师"/>
            </el-select>
        </el-form-item>

        <el-form-item label="入驻时间">
            <el-date-picker
            v-model="searchObj.joinDateBegin"
            placeholder="开始时间"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="-">
            <!-- v-model 双向绑定 在searchObj中会传入咱们的条件值 -->
            <el-date-picker
            v-model="searchObj.joinDateEnd"
            placeholder="结束时间"
            value-format="yyyy-MM-dd" />
        </el-form-item>

            <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>
    </el-card>

    <!-- 工具按钮 -->
    <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets" style="margin-top: 5px"></i>
        <span style="margin-top: 5px">数据列表</span>
        <el-button class="btn-add" @click="add()" style="margin-left: 10px;">添加</el-button>
        <el-button class="btn-add" @click="batchRemove()" >批量删除</el-button>
    </el-card>

    <!-- 表格 -->
    <!-- element-ui里的组件 拿过来直接使用 -->
    <!-- :data 是数据 list查出来数据的集合
    border stripe 基本的样式
    @selection-change  <el-table-column这里会加上一个复选框
     -->
    <el-table
        :data="list"  
        border
        stripe
        @selection-change="handleSelectionChange">
        <!--@selection-change="handleSelectionChange"  当复选框发生变化 事件会触发 方法会调用 -->
        <el-table-column type="selection"/> 
        <el-table-column
            label="#"
            width="50">
            <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="80" />
        <el-table-column label="头衔" width="90">
            <template slot-scope="scope"> 
                <!-- scope 代表域或范围  row 代表表格中的一行 level 代表每行中的level值-->
                <!-- 把每一行中的 level值取到 -->
            <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
            <el-tag v-if="scope.row.level === 2" size="mini">首席讲师</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="intro" label="简介" />
        <el-table-column prop="sort" label="排序" width="60" />
        <el-table-column prop="joinDate" label="入驻时间" width="160" />
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <!-- scope 代表整个表格 row 代表每行 id 代表每行的id -->
            <el-button type="text" size="mini" @click="removeById(scope.row.id)">删除</el-button>
            <router-link :to="'/vod/teacher/edit/'+scope.row.id">
                <el-button type="text" size="mini">修改</el-button>
            </router-link>
            </template>
        </el-table-column>
    </el-table>
      <!-- 分页组件 -->
      <!-- :page-sizes 可以选择每页显示多少条内容
      下面两个(style、layout)是样式
       @ 是vue中的绑定事件指令 size-change 是选的page-sizes 发生变化会触发
       current-change 是current-page 发生变化会触发
       -->
    <el-pagination
        :current-page="page" 
        :total="total"
        :page-size="limit"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        style="padding: 30px 0; text-align: center;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="changePageSize"
        @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
//引入定义接口js文件
import teacherApi from '@/api/vod/teacher' //框架中要求这样写 要使用@ 如果是js文件 可以省略后缀
export default { //这是他的约定结构 在里面加具体的结构
    data() {//初始值
        return {
            list: [], // 讲师列表
            total: 0, // 总记录数
            page: 1, // 当前页码
            limit: 10, // 每页记录数
            searchObj: {}, // 查询条件
            multipleSelection: []// 批量删除选中的记录列表  暂时用不到----在批量删除时用到了
        }
    },
    created() { //页面渲染之前
        this.fetchData()
    },
    methods: { //具体方法
        //批量删除
        batchRemove() {
            //判断非空
            if(this.multipleSelection.length===0){
                this.$message.warning('请选择要删除的记录！')
                return
            }
            this.$confirm('此操作将删除该讲师的信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => { //点确定执行的是then方法 点取消执行的是catch方法
                var idList = []
                //[1,2,3]
                //遍历数组
                for (var i = 0; i < this.multipleSelection.length; i++) {
                     var obj = this.multipleSelection[i]
                     var id = obj.id
                     //放到数组
                     idList.push(id)
                }
                //调用接口删除
                teacherApi.batchRemove(idList)
                    .then(response => {
                        //提示
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //刷新
                        this.fetchData()
                    })
                
            })
        },
        //复选框发生变化，调用方法，选中复选框行内容传递
        handleSelectionChange(selection) {
            this.multipleSelection = selection
            console.log(this.multipleSelection);
        },
        //跳转到添加表单页面
        add() {
            this.$router.push({path:'/vod/teacher/create'})
        },
        fetchData() {
            //ajax  teacherApi. 方法是点不出来的 可以复制过来
            teacherApi.pageList(this.page,this.limit,this.searchObj) //要使用当前vue中的属性和方法 需要加上this
                .then(response => { //response 就是接口返回的数据
                    // console.log(response);
                    this.list = response.data.records
                    this.total = response.data.total
                })
                // .catch  //如果有异常会怎么样 这里实际上不需要写 因为在request.js中的34行 拦截器已经处理了
                //框架中已经封装了
        },
        //改变每页显示的记录数
        changePageSize(size) {
            this.limit = size
            this.fetchData()
        },
        //改变页码数
        changeCurrentPage(page){
            this.page = page
            this.fetchData()
        },
        //清空
        resetData() {
            //把表单清空  即就是把searchObj清空就可以了
            this.searchObj = {}
            this.fetchData()
        },
        removeById(id) {
            this.$confirm('此操作将删除该讲师的信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => { //点确定执行的是then方法 点取消执行的是catch方法
                //调用接口删除
                teacherApi.removeTeacherId(id)
                    .then(response => {
                        //提示
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //刷新
                        this.fetchData()
                    })
                
            })
            //     .catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     });          
            // });
        }
    }
}
</script>