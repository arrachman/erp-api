const param = {}
// table identity
param.tableName = 'f1_contact_category';
param.primaryKey = 'cckode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'ccinputtgl, ccmodifikasitgl, cccustomdt1, cccustomdt2, cccustomdt3, cccustomdt4, cccustomdt5';

// Parameter for post data
param.validatorPost = {
           'cckode'   : 'required',
           'ccnama'   : 'required',
           'ccaktif'   : 'required|numeric|min:0|max:255',
           'ccinputuser'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
           'ccinputtgl'   : 'required|date',
           'cccustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomd1'   : 'required|numeric',
           'cccustomd2'   : 'required|numeric',
           'cccustomd3'   : 'required|numeric',
           'cccustomd4'   : 'required|numeric',
           'cccustomd5'   : 'required|numeric',
           'cccustomdt1'   : 'required|date',
           'cccustomdt2'   : 'required|date',
           'cccustomdt3'   : 'required|date',
           'cccustomdt4'   : 'required|date',
           'cccustomdt5'   : 'required|date'};
param.dataPost = 'cckode, ccnama, cccatatan, ccaktif, ccinputuser, ccinputtgl, cccustomt1, cccustomt2, cccustomt3, cccustomt4, cccustomt5, cccustomi1, cccustomi2, cccustomi3, cccustomi4, cccustomi5, cccustomd1, cccustomd2, cccustomd3, cccustomd4, cccustomd5, cccustomdt1, cccustomdt2, cccustomdt3, cccustomdt4, cccustomdt5';

// Parameter for update data
param.validatorUpdate = {
           'ccnama'   : 'required',
           'ccaktif'   : 'required|numeric|min:0|max:255',
           'ccmodifikasiuser'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
           'ccmodifikasitgl'   : 'required|date',
           'cccustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'cccustomd1'   : 'required|numeric',
           'cccustomd2'   : 'required|numeric',
           'cccustomd3'   : 'required|numeric',
           'cccustomd4'   : 'required|numeric',
           'cccustomd5'   : 'required|numeric',
           'cccustomdt1'   : 'required|date',
           'cccustomdt2'   : 'required|date',
           'cccustomdt3'   : 'required|date',
           'cccustomdt4'   : 'required|date',
           'cccustomdt5'   : 'required|date'};
param.dataUpdate = 'ccnama, cccatatan, ccaktif, ccmodifikasiuser, ccmodifikasitgl, cccustomt1, cccustomt2, cccustomt3, cccustomt4, cccustomt5, cccustomi1, cccustomi2, cccustomi3, cccustomi4, cccustomi5, cccustomd1, cccustomd2, cccustomd3, cccustomd4, cccustomd5, cccustomdt1, cccustomdt2, cccustomdt3, cccustomdt4, cccustomdt5';
module.exports = {
    app: app => {
        app.get('/f1/contact_category', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/contact_category/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/contact_category', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/contact_category/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/contact_category/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};