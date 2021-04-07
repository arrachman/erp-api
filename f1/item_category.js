const param = {}
// table identity
param.tableName = 'f1_item_category';
param.primaryKey = 'ickode';

// parameter for select data
param.select = '';
param.selectFormatDate = 'icinputtgl, icmodifikasitgl, iccustomdt1, iccustomdt2, iccustomdt3, iccustomdt4, iccustomdt5';

// Parameter for post data
param.validatorPost = {
           'ickode'   : 'required',
           'icnama'   : 'required',
           'icaktif'   : 'numeric|min:-127|max:127',
           'icinputuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'icinputtgl'   : 'required|date',
           'iccustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomd1'   : 'required|numeric',
           'iccustomd2'   : 'required|numeric',
           'iccustomd3'   : 'required|numeric',
           'iccustomd4'   : 'required|numeric',
           'iccustomd5'   : 'required|numeric',
           'iccustomdt1'   : 'required|date',
           'iccustomdt2'   : 'required|date',
           'iccustomdt3'   : 'required|date',
           'iccustomdt4'   : 'required|date',
           'iccustomdt5'   : 'required|date'};
param.dataPost = 'ickode, icnama, icdivisi, icsubdivisi, icdepartemen, icsubdepartemen, icrekpersediaan, icrekdiskonpembelian, icrekreturpembelian, icrekhargapokok, icrekkonsinyasi, icrekpenjualan, icrekdiskonpenjualan, icrekreturpenjualan, iccatatan, icaktif, icinputuser, icinputtgl, iccustomt1, iccustomt2, iccustomt3, iccustomt4, iccustomt5, iccustomi1, iccustomi2, iccustomi3, iccustomi4, iccustomi5, iccustomd1, iccustomd2, iccustomd3, iccustomd4, iccustomd5, iccustomdt1, iccustomdt2, iccustomdt3, iccustomdt4, iccustomdt5';

// Parameter for update data
param.validatorUpdate = {
           'icnama'   : 'required',
           'icaktif'   : 'numeric|min:-127|max:127',
           'icmodifikasiuser'   : 'required|numeric|min:0|max:18446744073709551615',
           'icmodifikasitgl'   : 'required|date',
           'iccustomi1'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi2'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi3'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi4'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomi5'   : 'required|numeric|min:-2147483647|max:2147483647',
           'iccustomd1'   : 'required|numeric',
           'iccustomd2'   : 'required|numeric',
           'iccustomd3'   : 'required|numeric',
           'iccustomd4'   : 'required|numeric',
           'iccustomd5'   : 'required|numeric',
           'iccustomdt1'   : 'required|date',
           'iccustomdt2'   : 'required|date',
           'iccustomdt3'   : 'required|date',
           'iccustomdt4'   : 'required|date',
           'iccustomdt5'   : 'required|date'};
param.dataUpdate = 'icnama, icdivisi, icsubdivisi, icdepartemen, icsubdepartemen, icrekpersediaan, icrekdiskonpembelian, icrekreturpembelian, icrekhargapokok, icrekkonsinyasi, icrekpenjualan, icrekdiskonpenjualan, icrekreturpenjualan, iccatatan, icaktif, icmodifikasiuser, icmodifikasitgl, iccustomt1, iccustomt2, iccustomt3, iccustomt4, iccustomt5, iccustomi1, iccustomi2, iccustomi3, iccustomi4, iccustomi5, iccustomd1, iccustomd2, iccustomd3, iccustomd4, iccustomd5, iccustomdt1, iccustomdt2, iccustomdt3, iccustomdt4, iccustomdt5';
module.exports = {
    app: app => {
        app.get('/f1/item_category', async(req, result) => help.tc(master.show, req, result, __line, __filename, param));
        app.get('/f1/item_category/:id', async(req, result) => help.tc(master.showById, req, result, __line, __filename, param));
        app.post('/f1/item_category', async(req, result) => help.tc(master.insert, req, result, __line, __filename, param));
        app.put('/f1/item_category/:id', async(req, result) => help.tc(master.update, req, result, __line, __filename, param));
        app.delete('/f1/item_category/:id', async(req, result) => help.tc(master.delete, req, result, __line, __filename, param));
    }    
};