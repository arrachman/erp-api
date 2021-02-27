const search = async(req) => {
    res = new help.Helpfix('showSearch');
    let table, select, selectDate, title, header;
    switch(req.params.id) {
        case 'coa':
            table      = 'f1_coa';
            select     = '*';
            selectDate = 'cinputtgl, cmodifikasitgl';
            title      = 'COA';
            header     = 
                [
                    ['cnomor', 'Nomor', 120],
                    ['cnama', 'Nama', 200],
                    ['cnamaalias1', 'Nama', 230],
                    ['cmatauang', 'Mata Uang', -1],
                ];
            break;
        case 'contact':
            table      = 'f1_contact';
            select     = '*';
            selectDate = 'kaktiftgl, ktglkontrak, ktgllahir, ktglnikah, kinputtgl, kmodifikasitgl, kcustomdate1, kcustomdate2, kcustomdate3';
            title      = 'Kontak';
            header     = 
                [
                    ['kkode', 'Kode', 120],
                    ['knama', 'Nama', 200],
                    ['kkategorinama', 'Kategori', 120],
                    ['k1notelp1', 'No HP', 120, 1],
                    ['k1alamat1', 'Alamat', 200],
                    ['k1kota', 'Kota', -1],
                ];
            break;
        case 'currency':
            table      = 'f1_currency';
            select     = '*';
            selectDate = 'cinputtgl, cmodifikasitgl';
            title      = 'Mata Uang';
            header     = 
                [
                    ['ckode', 'Kode', 120],
                    ['cnama', 'Nama', -1],
                ];
            break;
        case 'item':
            table      = 'f1_item';
            select     = '*';
            selectDate = '';
            title      = 'Mata Uang';
            header     = 
                [
                    ['bkode', 'Kode Barang', 120],
                    ['bnama', 'Nama Barang', 120],
                    ['bstok', 'Stok', 120, 2],
                    ['bstokbooking', 'Stok Booking', 120, 2],
                    ['bsatuan', 'Satuan', 120],
                    ['bhargajual1', 'Harga Jual', 120, 2, 'currency'],
                ];
            break;
    }

    return await master.showSearch(req, table, select, selectDate, title, header);
}


module.exports = {
    app: app => {
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });
        
        app.get('/f1/search/:id', async(req, result) => {
            let respond
            try {
                respond = await search(req)
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });

    }    

    
    
};