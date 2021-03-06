const param = {}
// table identity
param.tableName = 'f1_currency';
param.primaryKey = 'ckode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'cinputtgl, cmodifikasitgl';

// Parameter for post data
param.validatorPost = {
           'ckode'   : 'required',
           'cnama'   : 'required',
           'ckurs'   : 'required|numeric',
           'caktif'   : 'required|numeric|min:-127|max:127',
           'cinputuser'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
           'cinputtgl'   : 'required|date',
           'ckodenotransaksi'   : 'required'};
param.dataPost = 'ckode, cnama, csimbol, ckurs, ccatatan, caktif, cinputuser, cinputtgl, ckodenotransaksi';

// Parameter for update data
param.validatorUpdate = {
           'cnama'   : 'required',
           'ckurs'   : 'required|numeric',
           'caktif'   : 'required|numeric|min:-127|max:127',
           'cmodifikasiuser'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
           'cmodifikasitgl'   : 'required|date',
           'ckodenotransaksi'   : 'required'};
param.dataUpdate = 'cnama, csimbol, ckurs, ccatatan, caktif, cmodifikasiuser, cmodifikasitgl, ckodenotransaksi';
module.exports = {
    app: app => {
        app.get('/f1/currency', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/currency/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/currency', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/currency/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/currency/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};