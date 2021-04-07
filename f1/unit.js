const param = {}
// table identity
param.tableName = 'f1_unit';
param.primaryKey = 'ukode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'uinputtgl, umodifikasitgl, ucustomdt1, ucustomdt2, ucustomdt3, ucustomdt4, ucustomdt5';

// Parameter for post data
param.validatorPost = {
           'ukode'   : 'required',
           'unama'   : 'required',
           'unilai'   : 'required|numeric',
           'uaktif'   : 'required|numeric|min:-127|max:127',
           'uinputuser'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
           'uinputtgl'   : 'required|date',
           'ucustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomd1'   : 'required|numeric',
           'ucustomd2'   : 'required|numeric',
           'ucustomd3'   : 'required|numeric',
           'ucustomd4'   : 'required|numeric',
           'ucustomd5'   : 'required|numeric',
           'ucustomdt1'   : 'required|date',
           'ucustomdt2'   : 'required|date',
           'ucustomdt3'   : 'required|date',
           'ucustomdt4'   : 'required|date',
           'ucustomdt5'   : 'required|date'};
param.dataPost = 'ukode, unama, unilai, uketerangan, uaktif, uinputuser, uinputtgl, ucustomt1, ucustomt2, ucustomt3, ucustomt4, ucustomt5, ucustomi1, ucustomi2, ucustomi3, ucustomi4, ucustomi5, ucustomd1, ucustomd2, ucustomd3, ucustomd4, ucustomd5, ucustomdt1, ucustomdt2, ucustomdt3, ucustomdt4, ucustomdt5';

// Parameter for update data
param.validatorUpdate = {
           'unama'   : 'required',
           'unilai'   : 'required|numeric',
           'uaktif'   : 'required|numeric|min:-127|max:127',
           'umodifikasiuser'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
           'umodifikasitgl'   : 'required|date',
           'ucustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'ucustomd1'   : 'required|numeric',
           'ucustomd2'   : 'required|numeric',
           'ucustomd3'   : 'required|numeric',
           'ucustomd4'   : 'required|numeric',
           'ucustomd5'   : 'required|numeric',
           'ucustomdt1'   : 'required|date',
           'ucustomdt2'   : 'required|date',
           'ucustomdt3'   : 'required|date',
           'ucustomdt4'   : 'required|date',
           'ucustomdt5'   : 'required|date'};
param.dataUpdate = 'unama, unilai, uketerangan, uaktif, umodifikasiuser, umodifikasitgl, ucustomt1, ucustomt2, ucustomt3, ucustomt4, ucustomt5, ucustomi1, ucustomi2, ucustomi3, ucustomi4, ucustomi5, ucustomd1, ucustomd2, ucustomd3, ucustomd4, ucustomd5, ucustomdt1, ucustomdt2, ucustomdt3, ucustomdt4, ucustomdt5';
module.exports = {
    app: app => {
        app.get('/f1/unit', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/unit/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/unit', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/unit/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/unit/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};