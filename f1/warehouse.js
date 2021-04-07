const param = {}
// table identity
param.tableName = 'f1_warehouse';
param.primaryKey = 'wkode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'winputtgl, wmodifikasitanggal, wcustomdt1, wcustomdt2, wcustomdt3, wcustomdt4, wcustomdt5';

// Parameter for post data
param.validatorPost = {
           'wkode'   : 'required',
           'wnama'   : 'required',
           'wlokasi'   : 'required',
           'waktif'   : 'required|numeric|min:0|max:255',
           'winputuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'winputtgl'   : 'required|date',
           'wmodifikasitanggal'   : 'required|date',
           'wbookingstok'   : 'required|numeric|min:-127|max:127',
           'wcustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomd1'   : 'required|numeric',
           'wcustomd2'   : 'required|numeric',
           'wcustomd3'   : 'required|numeric',
           'wcustomd4'   : 'required|numeric',
           'wcustomd5'   : 'required|numeric',
           'wcustomdt1'   : 'required|date',
           'wcustomdt2'   : 'required|date',
           'wcustomdt3'   : 'required|date',
           'wcustomdt4'   : 'required|date',
           'wcustomdt5'   : 'required|date'};
param.dataPost = 'wkode, wnama, wdivisi, wlokasi, walamat1, walamat2, wkota, wkodepos, wnotelp, wnofax, wketerangan, waktif, winputuser, winputtgl, wmodifikasitanggal, wbookingstok, wcustomt1, wcustomt2, wcustomt3, wcustomt4, wcustomt5, wcustomi1, wcustomi2, wcustomi3, wcustomi4, wcustomi5, wcustomd1, wcustomd2, wcustomd3, wcustomd4, wcustomd5, wcustomdt1, wcustomdt2, wcustomdt3, wcustomdt4, wcustomdt5';

// Parameter for update data
param.validatorUpdate = {
           'wnama'   : 'required',
           'wlokasi'   : 'required',
           'waktif'   : 'required|numeric|min:0|max:255',
           'wmodifikasiuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'wmodifikasitanggal'   : 'required|date',
           'wbookingstok'   : 'required|numeric|min:-127|max:127',
           'wcustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'wcustomd1'   : 'required|numeric',
           'wcustomd2'   : 'required|numeric',
           'wcustomd3'   : 'required|numeric',
           'wcustomd4'   : 'required|numeric',
           'wcustomd5'   : 'required|numeric',
           'wcustomdt1'   : 'required|date',
           'wcustomdt2'   : 'required|date',
           'wcustomdt3'   : 'required|date',
           'wcustomdt4'   : 'required|date',
           'wcustomdt5'   : 'required|date'};
param.dataUpdate = 'wnama, wdivisi, wlokasi, walamat1, walamat2, wkota, wkodepos, wnotelp, wnofax, wketerangan, waktif, wmodifikasiuser, wmodifikasitanggal, wbookingstok, wcustomt1, wcustomt2, wcustomt3, wcustomt4, wcustomt5, wcustomi1, wcustomi2, wcustomi3, wcustomi4, wcustomi5, wcustomd1, wcustomd2, wcustomd3, wcustomd4, wcustomd5, wcustomdt1, wcustomdt2, wcustomdt3, wcustomdt4, wcustomdt5';
module.exports = {
    app: app => {
        app.get('/f1/warehouse', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/warehouse/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/warehouse', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/warehouse/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/warehouse/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};