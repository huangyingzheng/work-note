const _ = require("lodash");

const pathRegexp = /(.+?)[.]/;//https://regexper.com 正则表达+？ 表示一个， +是一到正无穷，？是零到一，所以+？是一， ‘.’代表一个字符，（）里面
//是要保存的内容，[.]指的是一个点字符，或许可以用\.代替，没试过；

const pushAll = function(array, objects) {
    array.push.apply(array, objects); //Inheritance methods
};

const getNextKV = function(object, path) { //键值对
    const kv = {k: null, v: null};// 建立一个空的obj

    const match = pathRegexp.exec(path);//创建一个匹配obj将符合的放入

    if(match)//如果物件不为空
    {
        kv.k = path.replace(pathRegexp, "");//将地址后面部分推入k abc.ced => ['ced']
        kv.pk = match[1];//建立新的属性 前k为正则 'abc'
        kv.v = object[match[1]];//对应该键obj的值
    }
    else {
        kv.v = object[path];//如果没有就将path作为新的键存入数据库
    }
    return kv;
};

const goTo = function(object, path) {
    if(! _.isString(path)) throw new Error("Path doit être une string");//obj里面的属性这个
    //必须是字符串

    let r;//创建变量r
    if(_.isPlainObject(object)) {//如果obj是标准的obj
        let newPath = path;// 建立一些新的东西
        let path2;
        let match;
        let o;
        do {
            match = pathRegexp.exec(newPath);//建立匹配数组 match
            newPath = newPath.replace(pathRegexp, "");// 将匹配片段玻璃

            if(match) {// 如果存在匹配片段 有相同的属性
                path2 = (path2 ? path2 + "." : "") + match[1];//path2真假性判断 得到属性标签
                o = object[path2];// 物件中标签属性的物件

                if(o !== undefined) {// 如果去得到
                    r = goTo(o, newPath);//去到指定的位置
                }
            }
            else {
                r = object[path];//无效标签直接返回
            }
        }
        while(match && o === undefined);
    }

    return r;
};

const goToAll = function(object, path, lastArray) {
    const r = [];//假设一个数组r

    if((! path) && (! lastArray)) {
        r.push(object);
    }// 如果路径和最后一个数组其中一个出错向r推送obj
    else if(_.isPlainObject(object)) {//如果obj被定义
        const kv = getNextKV(object, path);
        pushAll(r, goToAll(kv.v, kv.k));


    }
    else if(_.isArray(object)) {
        object.forEach(function(subObject) {
            const subR = goToAll(subObject, path);
            pushAll(r, subR);
        });
    }

    return r;
};
const forceMap = function(value, execute, forceArrayOutput) {
    if(! execute) execute = _.identity;
    return _.isArray(value) ?
        _.map(value, execute) :
        forceArrayOutput ? [execute(value)] : execute(value);
};

const filterFields = function(object, fields) {

    if(_.isArray(object)) {
        return object.map(function(object) {
            return filterFields(object, fields);
        });
    }

    if(! _.isPlainObject(object)) return object;

    const newObject = {};
    const childrenFields = {};
    fields.forEach(function(path) {
        const childMatch = pathRegexp.exec(path);
        if(childMatch) {
            const parentPath = childMatch[1];
            if(! childrenFields[parentPath]) childrenFields[parentPath] = [];
            childrenFields[parentPath].push(path.replace(pathRegexp, ""));
        }
        else if(! _.isUndefined(object[path])) newObject[path] = _.clone(object[path]);
    });

    _.forIn(childrenFields, function(array, path) {
        if(! _.isUndefined(object[path])) newObject[path] = filterFields(object[path], array);
    });

    return newObject;
};

function sum(a, b) {
    return a + b;
}

module.exports = {
    filterFields,
    forceMap,
    goTo,
    goToAll,
    sum
};
const toDeprect= require('./toDeprect')
const _ = require("lodash");

describe('filterFields', () => {
    test('sum numbers', () => {


        expect(
            toDeprect.sum(1, 2)
        ).toEqual(
            3
        )
    })

})
// describe('goTo', () => {
//     it('basic', () => {
//         const object = {
//             a: { a1: 1, a2: 2 , a3:'value', a4:[1]},
//             b: { b1: 3, b2: 4 },
//             d:'12'
//
//         };
//          const path = 'd';
//         // const c=[12];
//
//
//
//         const getOnB = toDeprect.goTo(object, 'b.b2')
//         // const getOnC =  3
//         // const getOnC =  toDeprect.goTo(object,c)
//         const getOnD =  toDeprect.goTo(object,'d')
//         // const getOnA3 =  toDeprect.goTo(object,'a.a6')
//
//
//         expect(getOnB).toEqual(4)// number => string ok
//         expect(
//             toDeprect.goTo(object,path)
//         ).toEqual('12')// string not ok??
//         expect(()=>getOnD()).toThrow(Error)// string not ok
//         expect(()=> {
//             return toDeprect.goTo(object,path)
//         }).toThrow(Error)//question
//         expect(()=>getOnB()).toThrow(Error)//question??
//
//
//         // expect(()=>getOnA2()).toThrow(Error)
//         // expect(()=>getOnA3()).toThrow(Error)
//
//     })
// })
    global.describe ('goTo',()=>{
    const object ={
        a: { a1: 1, a2: 2 },
        b: { b1: '12', b2: 4 },
        c: [{c1:1},{c2:2}],
        d: 12
    };
    // const getToD = toDeprect.goTo(object,'d')
    // test ('basic',()=>
    // {
    //     expect(getToD).toEqual(12);
    // })
    //     var s = 'a.a1';
    //     var s = toString(object['d'])
    const getToD = toDeprect.goTo(object,'d')
    test ('basic_1',()=>
    {
        expect(getToD).toEqual(12);
    })
    // const getToB = toDeprect.goTo(object,'')
})

global.describe('filerFields', () => {
    it('keep property', () => {
        const object = {
            a: '1',
            bababa: '2',
            c: '3'
        }
        const paths = ['a','bababa', 'g']
        const t1 = toDeprect.filterFields(object,paths)

        expect(t1).toEqual({
            a: '1',
            bababa: '2'
        })

        expect(t1).not.toHaveProperty('c');
    })

    it('recursive on children objects',() => {
        const object = {
            a: {
                b: 1,
                c: 2
            },
            d:3
        }
        const paths = ['a.b', 'd']
        const t1 = toDeprect.filterFields(object,paths)

        expect(t1).toEqual({
            a: { b: 1 },
            d: 3
        })
    })

    it('recursive on array',() => {
        const object = {
            a: [
                {b: 3, c: 4},
                {b: 5, c: 6}
            ]
        }
        const paths = ['a.b']
        const t1 = toDeprect.filterFields(object,paths)

        expect(t1).toEqual({
            a: [
                { b: 3 },
                { b: 5 }
            ]
        })
    })

    it('missing children objects',() => {
        const object = {
            a: null,
            d:3
        }
        const paths = ['a.b', 'd']
        const t1 = toDeprect.filterFields(object,paths)

        expect(t1).toEqual({
            a: null,
            d: 3
        })
    })

    it('clone on children object',() => {
        const object = {
            a: {
                b: 1,
                c: 2
            },
            d:3
        }
        const paths = ['a']
        const t1 = toDeprect.filterFields(object,paths)

        expect(t1).toEqual({
            a: {
                b: 1,
                c: 2
            }
        })
        expect(t1.a).not.toBe(object.a);
    })
})
