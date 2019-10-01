void function () {
    a();
    function a() {
        // empty
    }
}();
function doSomethingElse() {
    doAnotherThing; 
    function doAnotherThing() {
        //
    }
}
if (test) {
    function doSomething() { }
}

