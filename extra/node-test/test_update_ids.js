var dm = require("./dm");

var gen_data;

module.exports = {
    
    deleteDB: function (test) {
        test.expect(1);
        dm.couchDb("test_db").remove(function (err, data)  {
            dm.couchDb("test_db").info(function (err, data) {
                test.ok(err),
                test.done();
            });
        });
    },

    createDB: function (test) {
        test.expect(1);
        dm.couchClient().replicate("datamanager", "test_db", 
                                   {create_target:true, doc_ids : ["_design/datamanager"]}, 
                                   function() {
                                       dm.couchDb("test_db").info(function (err, data) {
                                           test.ok(data),
                                           test.done();
                                       });
                                   });

    },

    generateData : function (test) {
        test.expect(2);

        dm.dm("test_db", "datamanager/generate_test_data", 
              {}, null, function (err, data) {
                  test.ok(!err);
                  console.log(err, data);
                  gen_data = data;
                  dm.couchDb("test_db").getDoc(gen_data.mm_ref_id, function (err, mm) {
                      test.ok(mm.name);
                      test.done();
                  });
                  
              });
    },
             
    update_mm : function (test) {
        test.expect(2);
        
        console.log(gen_data.mm_ref_id);
        dm.dm("test_db", "update_mm", {mm : gen_data.mm_ref_id}, null, function (err, data) {
            console.log(err, data);
            test.ok(data.status == 'ok');
             dm.dm("test_db", "update_mm", {mm : gen_data.mm_ref_id}, null, function (err, data) {
                    console.log(err, data);
                    test.ok(data.status == 'ok');
                    test.done();
                });
           
        });
    },
    
    update_mm2 : function (test) {
        test.expect(2);
        var cpt = 2;
        function next() {
            cpt --
            if(!cpt) {
                test.done();
            }
        }
         dm.dm("test_db", "update_mm", {mm : gen_data.mm_ref_id}, null, function (err, data) {
                console.log(err, data);
                test.ok(data.status === 'ok');
                next();
            });
        
        dm.dm("test_db", "update_mm", {mm : gen_data.mm_ref_id}, null, function (err, data) {
            console.log(err, data);
            test.ok(err);
            next();
        });
    }
   
};
