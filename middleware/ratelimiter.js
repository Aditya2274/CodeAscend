import client from "../config/redis.js";
const submitCodeRateLimiter=async(req,res,next)=>{
    const userId=req.result._id
    const redisKey=`submit_cooldown:${userId}`;
    try{
        //Check if user has a recent submission
        const exists=await client.exists(redisKey);

        if(exists){
            return res.status(429).json({
                error:'Please wait 10 seconds before submitting again'
            });
        }
        //Set CoolDown period
        await client.set(redisKey,'cooldown_active',{
            EX: 10, //Expire after 10 seconds
            NX: true //Only set if not exists
        })
        next();
    }
    catch(err){
      console.err("Rate Limiter error",err);
    }
}
export default submitCodeRateLimiter