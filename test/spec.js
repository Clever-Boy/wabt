function createModule(a) {
  var ffi = {print: print};
  var u8a = new Uint8Array(a);
  print('instantiating module');
  var module = WASM.instantiateModule(u8a.buffer, ffi);
  return module;
}

function assert(x) {
  if (!x)
    throw('Error!');
};

function startsWith(s, prefix) {
  return s.lastIndexOf(prefix, 0) == 0;
}

function runTests(module) {
  var passed = 0;
  var failed = 0;
  for (var name in module) {
    if (module[name] instanceof Function) {
      if (startsWith(name, '$assert_eq')) {
        var f = module[name];
        var result = f();
        if (result == 1) {
          passed++;
        } else {
          print(name + " failed, expected 1, got " + result);
          failed++;
        }
      }
    }
  }
  print(passed + "/" + (passed + failed) + " tests passed.");
}
