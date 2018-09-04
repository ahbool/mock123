
# mock数据服务

## 1、概述

一个基于node.js的轻量级API mock服务。


- 支持GET和POST请求、支持跨域
- mock文件支持 `.js` 文件和 `.json` 文件
- `json文件` 用来存放固定的模拟数据，而 `js文件` 可更加自由的处理并返回模拟数据
- 修改mock文件后，无需重启node服务，重新调用接口即返回新的数据


&nbsp;

## 2、安装

```
npm install mock123 -g
```



## 3、启动服务

在存放mock数据的文件夹下执行命令启动服务。

如果mock数据文件放在名为 `mock-data` 的文件夹下，则在`mock-data`文件夹下执行以下命令。

以下命令默认端口为 **`7777`**
```
mock123 start
```

或者使用自定义端口
```
mock123 start 6666
```

服务启动后，访问地址为
```
http://localhost:7777
```


## 4、创建mock数据文件

在存放mock数据的目录下新建 `.json` 或者 `.js` 为后辍的文件。


**mock规则示例如下：**

如果对同一接口分别创建了`js`和`json`两个mock文件，会优先取`js文件`的数据。


#### 1） 命名规则

mock文件名必须和API接口的文件名一致，才能将API和mock文件匹配。

> 例1：
>
> 如果api接口为 `/service/user/getUserInfo`
>
> 则mock数据文件名为 `getUserInfo.js` 或者 `getUserInfo.json`
>
> 例2：
>
> 如果api接口为 `/service/user/getUserInfo.do`
>
> 则mock数据文件名为 `getUserInfo.do.js` 或者 `getUserInfo.do.json`




#### 2）文件内容

- `API接口名.json` 文件只支持json格式的数据

示例:

```js
{
  "code": 1,
  "msg": "message...",
  "data":{
      "age": 520,
      "card": 10099
  },
  "servertime": 1534835882204
}
```

- `API接口名.js` 文件必须导出一个函数，并在导出的函数中返回mock数据。函数接收两个参数

示例：

```js
/*
    返回mock数据

    @param {object} getData  api接口接收到的GET数据
    @param {object} postData api接口接收到的POST数据
 */
module.exports = (getData, postData) => {
    let data = {}
    let name = getData.type === 1 ? 'GG' : 'MM'

    if(postData.userId === '123'){
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
```

## 5、完整示例

**1）** 先安装包
```
npm install mock123 -g
```

**2）** 在任意位置新建一个文件夹 `mock-test`

**3）** 在 `mock-test` 目录下新建mock数据文件 `test.json`，并添加内容如下：
```js
{
  "code": 1,
  "msg": "message...",
  "data":{
      "age": 520,
      "card": 10099
  },
  "servertime": 1534835882204
}
```

**4）** 在 `mock-test` 目录下面执行命令启动mock服务 *(默认端口7777)*
```
//如果启动服务出错，有可能是端口冲突，需更换端口
mock123 start
```

**5）** 打开浏览器，输入以下地址，访问mock文件
```
http://localhost:7777/api/test
http://localhost:7777/api/aa/bb/test
http://localhost:7777/service/aa/test
http://localhost:7777/abc/test
```

请求地址只要以`test`结尾的，都可以访问到上面创建的 `test.json` 文件


**6）** 项目中使用

以webpack4为例：

```js
//接口host地址，区分生产环境和测试环境
apiBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://api.github.com'
    : 'http://localhost:7777'

api = apiBaseURL + '/api/user/test'
```