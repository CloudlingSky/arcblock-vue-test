<template>
  <div id="app" style="padding: 20px">
    <div style="margin-top: 15px;">
      <el-input placeholder="input the block hash" v-model="hash" class="input-with-select">
        <el-button :loading="isLoading" @click="search" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <div class="content" v-if="data!=null" style="margin: 20px">
        <h3>Bitcoin Block
          #{{data.block_index}}</h3>

      <h4 style="margin-top: 30px">
        Details
      </h4>

      <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple">Hash</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple value">{{data.hash}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">Size</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple value">{{data.size}}</div></el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple">Transactions</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple value">{{data.n_tx}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple value"></div></el-col>
      </el-row>

      <h4 style="margin: 20px 0px">Transactions</h4>
      <el-card class="box-card" v-for="(item,index) in renderData" style="margin-bottom: 20px">
        <el-collapse v-model="activeNames" >

        <el-collapse-item>
          <template slot="title">
            <div style="display: flex;flex-direction: row;">
              <div style="flex:1;display: flex;flex-direction: column">
                <div>
                  TX {{item.index}} •Hash <span>{{item.simple_hash}}</span>
                </div>
                <div>
                  {{getTime(item.time)}}
                </div>

              </div>
            </div>
          </template>
          <div style="margin-top: 20px;display: flex;flex-direction: row">
            <div style="width:50%;display: flex;flex-direction: column">
                <div>From</div>
                <div v-for="(from,fromIndex) in item.inputs" style="overflow: hidden;text-overflow: ellipsis">
                  {{fromIndex+1}}.{{from.script}}
                </div>
            </div>
            <div style="width:50%;display: flex;flex-direction: column;">
              <div>To</div>
              <div v-for="(to,toIndex) in item.out" style="width: 100%">
                {{toIndex+1}}.{{to.script}}
              </div>
            </div>
          </div>
        </el-collapse-item>
        </el-collapse>

      </el-card>
    </div>

    <el-pagination v-if="data!=null"
        :page-size="size"
        :pager-count="5"
        layout="prev, pager, next"
                   @current-change="handleCurrentChange"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>

import {rawblock} from "./api";

export default {
  name: 'App',
  data() {
    return {
      hash: '',
      isLoading:false,
      data:null,
      page:0,
      size:10,
      activeNames: ['1'],
      total:0
    }
  },
  components: {

  },
   created() {



  },
  computed:{
    renderData(){
      const d = []
      const max = (this.page+1)*this.size>this.data.tx.length?this.data.tx.length:(this.page+1)*this.size
      for(let i=this.page*this.size;i<max;i++){
        const t = this.data.tx[i]
        t.simple_hash = t.hash.slice(0,3)
        d.push({
          ...t,
          index:i
        })
      }
      return d;
    }
  },


  methods: {
    handleCurrentChange(val){
      this.page = val-1
    },
    search(){
      this.getData()
    },
    getTime(t){
      const d = new Date(t*1000)
      return  d.toLocaleString().replace(/:\d{1,2}$/,' ');
    },
    async getData() {
      this.isLoading = true
      const res = await rawblock(this.hash)
      this.isLoading = false
      if(res.status == 200){
         this.data = res.data
        this.total = this.data.tx.length
         console.log(this.data)


      }else{
        alert('网络链接失败')
      }
    }
  }
}
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
.grid-content{ overflow: hidden;text-overflow: ellipsis}
.value{color: #999999}
.el-collapse-item__header{border-bottom: none;border-top: none}
.el-collapse{border-top: none}
</style>
