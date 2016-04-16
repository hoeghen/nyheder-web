


/**
 * Created by cha on 4/16/2016.
 */


var mitObject =  {
    var1 : "test",
    func1: function(){

        function func2(){
            console.log("testing")
            console.log(this.var1)
        }
        func2()
    }
}

mitObject.func1()
console.log("done")