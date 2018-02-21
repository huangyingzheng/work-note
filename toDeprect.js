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
