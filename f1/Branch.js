const param = {}
// table identity
param.tableName = 'f1_branch';
param.primaryKey = 'bkode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'binputtgl, bmodifikasitgl, bcustomdt1, bcustomdt2, bcustomdt3, bcustomdt4, bcustomdt5';

// Parameter for post data
param.validatorPost = {
           'bkode'   : 'required',
           'bnama'   : 'required',
           'bkodetransaksi'   : 'required',
           'baktif'   : 'required|numeric|min:-127|max:127',
           'binputuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'binputtgl'   : 'required|date',
           'bcustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomd1'   : 'required|numeric',
           'bcustomd2'   : 'required|numeric',
           'bcustomd3'   : 'required|numeric',
           'bcustomd4'   : 'required|numeric',
           'bcustomd5'   : 'required|numeric',
           'bcustomdt1'   : 'required|date',
           'bcustomdt2'   : 'required|date',
           'bcustomdt3'   : 'required|date',
           'bcustomdt4'   : 'required|date',
           'bcustomdt5'   : 'required|date'};
param.dataPost = 'bkode, bnama, bkodetransaksi, balamat1, balamat2, bkota, bkodepos, bnotelp, bnofax, bcatatan, baktif, binputuser, binputtgl, bcustomt1, bcustomt2, bcustomt3, bcustomt4, bcustomt5, bcustomi1, bcustomi2, bcustomi3, bcustomi4, bcustomi5, bcustomd1, bcustomd2, bcustomd3, bcustomd4, bcustomd5, bcustomdt1, bcustomdt2, bcustomdt3, bcustomdt4, bcustomdt5';

// Parameter for update data
param.validatorUpdate = {
           'bnama'   : 'required',
           'bkodetransaksi'   : 'required',
           'baktif'   : 'required|numeric|min:-127|max:127',
           'bmodifikasiuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'bmodifikasitgl'   : 'required|date',
           'bcustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'bcustomd1'   : 'required|numeric',
           'bcustomd2'   : 'required|numeric',
           'bcustomd3'   : 'required|numeric',
           'bcustomd4'   : 'required|numeric',
           'bcustomd5'   : 'required|numeric',
           'bcustomdt1'   : 'required|date',
           'bcustomdt2'   : 'required|date',
           'bcustomdt3'   : 'required|date',
           'bcustomdt4'   : 'required|date',
           'bcustomdt5'   : 'required|date'};
param.dataUpdate = 'bnama, bkodetransaksi, balamat1, balamat2, bkota, bkodepos, bnotelp, bnofax, bcatatan, baktif, bmodifikasiuser, bmodifikasitgl, bcustomt1, bcustomt2, bcustomt3, bcustomt4, bcustomt5, bcustomi1, bcustomi2, bcustomi3, bcustomi4, bcustomi5, bcustomd1, bcustomd2, bcustomd3, bcustomd4, bcustomd5, bcustomdt1, bcustomdt2, bcustomdt3, bcustomdt4, bcustomdt5';
module.exports = {
    app: app => {
        app.get('/f1/branch', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/branch/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/branch', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/branch/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/branch/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};