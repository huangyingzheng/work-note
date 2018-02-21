const _ = require("lodash");

const pathRegexp = /(.+?)[.]/;//https://regexper.com 正则表达+？ 表示一个， +是一到正无穷，？是零到一，所以+？是一， ‘.’代表一个字符，（）里面
//是要保存的内容，[.]指的是一个点字符，或许可以用\.代替，没试过；

const pushAll = function(array, objects) {
    array.push.apply(array, objects);
};

const getNextKV = function(object, path) {
    const kv = {k: null, v: null};

    const match = pathRegexp.exec(path);

    if(match) {
        kv.k = path.replace(pathRegexp, "");
        kv.pk = match[1];
        kv.v = object[match[1]];
    }
    else {
        kv.v = object[path];
    }
    return kv;
};

const goTo = function(object, path) {
    if(! _.isString(path)) throw new Error("Path doit être une string");

    let r;
    if(_.isPlainObject(object)) {
        let newPath = path;
        let path2;
        let match;
        let o;
        do {
            match = pathRegexp.exec(newPath);
            newPath = newPath.replace(pathRegexp, "");

            if(match) {
                path2 = (path2 ? path2 + "." : "") + match[1];
                o = object[path2];

                if(o !== undefined) {
                    r = goTo(o, newPath);
                }
            }
            else {
                r = object[path];
            }
        }
        while(match && o === undefined);
    }

    return r;
};

const goToAll = function(object, path, lastArray) {
    const r = [];

    if((! path) && (! lastArray)) {
        r.push(object);
    }
    else if(_.isPlainObject(object)) {
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
