const param = {}
// table identity
param.tableName = 'f1_location';
param.primaryKey = 'lkode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'linputtgl, lmodifikasitanggal, lcustomdt1, lcustomdt2, lcustomdt3, lcustomdt4, lcustomdt5';

// Parameter for post data
param.validatorPost = {
           'lkode'   : 'required',
           'lnama'   : 'required',
           'lkodetransaksi'   : 'required',
           'lcabang'   : 'required',
           'laktif'   : 'required|numeric|min:0|max:255',
           'lluas'   : 'required|numeric',
           'linputuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'linputtgl'   : 'required|date',
           'lmodifikasitanggal'   : 'required|date',
           'lcustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomd1'   : 'required|numeric',
           'lcustomd2'   : 'required|numeric',
           'lcustomd3'   : 'required|numeric',
           'lcustomd4'   : 'required|numeric',
           'lcustomd5'   : 'required|numeric',
           'lcustomdt1'   : 'required|date',
           'lcustomdt2'   : 'required|date',
           'lcustomdt3'   : 'required|date',
           'lcustomdt4'   : 'required|date',
           'lcustomdt5'   : 'required|date'};
param.dataPost = 'lkode, lnama, lkodetransaksi, lcabang, lkategoripos, laktif, lalamat1, lalamat2, lkota, lkodepos, lnotelp, lnofax, lluas, lcatatan, linputuser, linputtgl, lmodifikasitanggal, lcustomt1, lcustomt2, lcustomt3, lcustomt4, lcustomt5, lcustomi1, lcustomi2, lcustomi3, lcustomi4, lcustomi5, lcustomd1, lcustomd2, lcustomd3, lcustomd4, lcustomd5, lcustomdt1, lcustomdt2, lcustomdt3, lcustomdt4, lcustomdt5';

// Parameter for update data
param.validatorUpdate = {
           'lnama'   : 'required',
           'lkodetransaksi'   : 'required',
           'lcabang'   : 'required',
           'laktif'   : 'required|numeric|min:0|max:255',
           'lluas'   : 'required|numeric',
           'lmodifikasiuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'lmodifikasitanggal'   : 'required|date',
           'lcustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'lcustomd1'   : 'required|numeric',
           'lcustomd2'   : 'required|numeric',
           'lcustomd3'   : 'required|numeric',
           'lcustomd4'   : 'required|numeric',
           'lcustomd5'   : 'required|numeric',
           'lcustomdt1'   : 'required|date',
           'lcustomdt2'   : 'required|date',
           'lcustomdt3'   : 'required|date',
           'lcustomdt4'   : 'required|date',
           'lcustomdt5'   : 'required|date'};
param.dataUpdate = 'lnama, lkodetransaksi, lcabang, lkategoripos, laktif, lalamat1, lalamat2, lkota, lkodepos, lnotelp, lnofax, lluas, lcatatan, lmodifikasiuser, lmodifikasitanggal, lcustomt1, lcustomt2, lcustomt3, lcustomt4, lcustomt5, lcustomi1, lcustomi2, lcustomi3, lcustomi4, lcustomi5, lcustomd1, lcustomd2, lcustomd3, lcustomd4, lcustomd5, lcustomdt1, lcustomdt2, lcustomdt3, lcustomdt4, lcustomdt5';
module.exports = {
    app: app => {
        app.get('/f1/location', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/location/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/location', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/location/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/location/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};