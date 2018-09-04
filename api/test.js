
/*
    返回mock数据

    @param {object} getData  接口的GET数据
    @param {object} postData 接口的POST数据
 */
module.exports = (getData, postData) => {
    let data = {}

    if(postData.userId === 'xxx'){
        data = {
            code:1000,
            msg: 'message...',
            data:{
                name:"A",
                age: 50
            }
        }
    } else {
        data = {
            code:2000,
            msg: 'message...',
            data:{
                name:"B",
                age: 80
            }
        }
    }

    data.__data__ = {
        get: getData,
        post: postData
    }

    return data
}
