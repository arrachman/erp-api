const param = {}
// table identity
param.tableName = 'f0_user';
param.primaryKey = 'userid';

// parameter for select data
param.select = '';
param.selectFormatDate = 'utglexpired, uinputtgl, umodifikasitgl';

// Parameter for post data
param.validatorPost = {
           'userid'   : 'required|numeric|min:0|max:18446744073709551615',
           'ukode'   : 'required',
           'unama'   : 'required',
           'upassword'   : 'required',
           'uemail'   : 'required',
           'ukontak'   : 'numeric|min:-9223372036854775808|max:9223372036854775808',
           'uaktif'   : 'required|numeric|min:-127|max:127',
           'utglexpired'   : 'date',
           'ulevel'   : 'required|numeric|min:-127|max:127',
           'ugrup'   : 'numeric|min:-127|max:127',
           'ubahasa'   : 'required',
           'udefaultview'   : 'numeric|min:-2147483647|max:2147483647',
           'uinputuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'uinputtgl'   : 'required|date'};
param.dataPost = 'userid, ukode, unama, upassword, uemail, ukontak, ucabang, ulokasi, ugudang, ukota, ugambar, uaktif, utglexpired, ulevel, ugrup, ubahasa, udefaultview, utoken, uinputuser, uinputtgl';

// Parameter for update data
param.validatorUpdate = {
           'ukode'   : 'required',
           'unama'   : 'required',
           'upassword'   : 'required',
           'uemail'   : 'required',
           'ukontak'   : 'numeric|min:-9223372036854775808|max:9223372036854775808',
           'uaktif'   : 'required|numeric|min:-127|max:127',
           'utglexpired'   : 'date',
           'ulevel'   : 'required|numeric|min:-127|max:127',
           'ugrup'   : 'numeric|min:-127|max:127',
           'ubahasa'   : 'required',
           'udefaultview'   : 'numeric|min:-2147483647|max:2147483647',
           'umodifikasiuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'umodifikasitgl'   : 'required|date'};
param.dataUpdate = 'ukode, unama, upassword, uemail, ukontak, ucabang, ulokasi, ugudang, ukota, ugambar, uaktif, utglexpired, ulevel, ugrup, ubahasa, udefaultview, utoken, umodifikasiuser, umodifikasitgl';
module.exports = {
    app: app => {
        app.get('/f1/f0_user', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/f0_user/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/f0_user', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/f0_user/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/f0_user/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};