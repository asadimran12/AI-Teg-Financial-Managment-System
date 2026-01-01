const cron=require("node-cron");
const {Op}=require("sequelize");
const ForgetPassword=require("../model/ForgetPassword");
cron.schedule("*/1 * * * *",async()=>{
  const OneMinuteAgo=new Date(Date.now()-60*1000);
  await ForgetPassword.destroy({
    where:{
      createdAt:{[Op.lt]:OneMinuteAgo}
    }
  })
})