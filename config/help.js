Object.defineProperty(global, '__stack', {
    get: function(){
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
    });
    
Object.defineProperty(global, '__line', {
    get: function(){
        return __stack[1].getLineNumber();
    }
});
Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

q = async(query, trans) => 
{
    let run = await trans ? trans.raw(query) : knex.raw(query);
    return run[0];
}

const tc = async(tryFunc, req, result, line, filename, param) => {
    let respond
    try {
        const token = req.headers.token;
        
        // var decoded = jwt.verify(token, process.env.SECRET);
        // res.data = decodesd;
        // respond = res.fail('Need Login', 401)
        respond = await tryFunc(req, param)
        // if(Object.keys(tokenList).length == 0) {
        //     respond = res.fail('Need Login', 401)

        // } else if(tokenList[token]) {
        //     getAuth = tokenList[token]
        //     let count = parseInt(tokenList[token].resetToken) - Math.floor(Date.now() / 1000)
        //     let count_exp = tokenList[token].refreshToken - Math.floor(Date.now() / 1000)
        //     res.data = {tokenList : tokenList[token], count, count_exp}
        //     if(count<=0 || count_exp <= 0) {
        //         respond = res.fail('JWT expired', 401)
        //     }
        //     else {
        //         tokenList[token].resetToken = Math.floor(Date.now() / 1000) + parseInt(process.env.RESET_AUTH) 
        //         respond = await tryFunc(req, param)
        //     }
        // } else  {
        //     respond = res.fail('Auth wrong', 401)

        // }
    }
    catch (err) {
        respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), line, filename)
    }
    result.header("Access-Control-Allow-Origin", "*");
    result.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    result.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    result.status(respond.status).send(respond.send);
} 

function formatDate(data)
{
    var moment = require('moment');
    return moment(data).format('DD/MM/YYYY HH:mm:ss');
}

function strToArray(data)
{
    return data.split(' ').join('').split(',');
}

M2_Accounting_PeriodeCheck = async(tglAwal = '', tglAkhir = '') =>
{
    let respond = {"success": 0, "errmessage":""};
    filter = "";
        
    //  CEK TIPE DATA =============================================
    cekTipeData = isDate(tglAwal, 'tglAwal');
    if (!cekTipeData.success) 
    {
        respond.errmessage = cekTipeData.info; return respond;
    }
    // else
        // tglAwal = AsFormatTanggal(tglAwal);

    cekTipeData = isDate(tglAkhir, 'tglAkhir');
    if (!cekTipeData.success) 
    {
        respond.errmessage = cekTipeData.info; return respond;
    }
//         Else
//             tglAkhir = AsFormatTanggal(tglAkhir)
//         End If
    //  END OF CEK TIPE DATA ======================================

    //  BUAT FILTER ===============================================
    awal = get_date(tglAwal);
    akhir = get_date(tglAkhir);
    //  jika tahun berbeda
    if (awal.year != akhir.year) 
    {
        filter = "((aptahun = '" + awal.year + "' AND apbulan >= '" + awal.month + "') or (aptahun > '" + awal.year + "' AND aptahun < '" + akhir.year + "') or (aptahun = '" + akhir.year + "' AND apbulan <= '" + akhir.month + "'))";
        //  jika tahun sama
    }        
    else if (awal.year == akhir.year) 
    {
        //  jika bulan sama
        if (awal.month == akhir.month) 
            filter = "((aptahun = '" + awal.year + "') AND (apbulan = '" + awal.month + "'))";
        //  jika bulan beda
        else
            filter = "((aptahun = '" + awal.year + "') AND (apbulan BETWEEN '" + awal.month + "' AND '" + akhir.month + "'))";
    }
    //  END OF BUAT FILTER ========================================


    // 'CEK PERIODE AKUNTANSI SUDAH TUTUP/BELUM
    dt = await knex.raw("SELECT aptahun, apbulan FROM f2_accounting_period WHERE " + filter + " AND aptutupperiode = '1'");
    if (dt[0].length > 0) 
    {
        respond.success = 0; 
        respond.errmessage = "Accounting Periode : Year = '" + dt[0][0] + "', Month = '" + dt[0][1] + "' has closed." ; 
        return respond;
    }
    respond.success = 1;
    return respond;
}

insertHistory = async(t, table, primaryKey, primaryKeyDetail, notransaksi, idtransaksi) =>
{
    await t.raw(`INSERT INTO ${table}_history(SELECT 0, fix.* FROM ${table} fix WHERE fix.${primaryKey} = ${idtransaksi})`);
    await t.raw(`INSERT INTO ${table}_detail_history (SELECT 0, ` + 1234 + `, fix.* FROM ${$table}_detail fix WHERE fix.${primaryKeyDetail} = ${idtransaksi} )`);
}

M0_Notransaksi = async(t, cabang, lokasi, kodetabel, tgl, sumber = "", smodule = 0, matauang = "") =>
{
    respond = {}
    respond.success = false
    respond.notransaksi = ""; mukodenotransaksi = "";
    awalan = ""; withLokasi = "1";
    respond.sqlambil = ""; respond.sql = "";
    respond.success = 0; jmldigit = 0; noberikutnya = 0;
    respond.errmessage = ""; rsSetting = "";
    sgrup = (smodule == 0) ? "accounting" : "options";

    //  AMBIL SETTING, PAKAI CABANG ATAU TIDAK
    rsSetting = await F_getSetting(smodule, sgrup, sumber + "NoTransactionCabang");
    withCabang = (notEmpty(rsSetting)) ? rsSetting : 1;
    if (withCabang != 1) cabang = "--";

    // 'AMBIL SETTING, PAKAI LOKASI ATAU TIDAK
    rsSetting = await F_getSetting(smodule, sgrup, sumber + "NoTransactionLokasi");
    withLokasi = (notEmpty(rsSetting)) ? rsSetting : 1;
    if (withLokasi != 1) lokasi = "--";

    // 'AMBIL SETTING, PAKAI SUMBER ATAU TIDAK
    rsSetting = await F_getSetting(smodule, sgrup, sumber + "NoTransactionSumber");
    withSumber = (notEmpty(rsSetting)) ? rsSetting : 1;

    // 'AMBIL SETTING, PAKAI TAHUN ATAU TIDAK
    rsSetting = await F_getSetting(smodule, sgrup, sumber + "NoTransactionTahun");
    withTahun = (notEmpty(rsSetting)) ? rsSetting : 1;

    // 'AMBIL SETTING, PAKAI BULAN ATAU TIDAK
    rsSetting = await F_getSetting(smodule, sgrup, sumber + "NoTransactionBulan");
    withBulan = (notEmpty(rsSetting)) ? rsSetting : 1;

    // 'AMBIL SETTING, RESET PERBULAN ATAU PERTAHUN
    rsSetting = await F_getSetting(smodule, sgrup, sumber + "NoTransactionPeriode");
    resetBulan = (notEmpty(rsSetting)) ? rsSetting : 1;

    // 'SET TAHUN, BULAN
    get_tgl = get_date(tgl);
    thn = get_tgl.year;
    bln = get_tgl.month;

    blnFilter = bln;
    if (resetBulan != 1) blnFilter = "1";

    if (withLokasi == 1)
    {
        // 'AMBIL KODE TRANSAKSI LOKASI
        sqlambil = "SELECT lkodetransaksi FROM f1_location WHERE lkode = '" + lokasi + "'";
        dt = await knex_select(sqlambil);
        if (notEmpty(dt))
            lokasi = dt[0].lkodetransaksi;
        else
        {
            respond.errmessage = "Could not find Transaction Code for '" + lokasi + "' location."; return respond
        }
    }

    // 'AMBIL KODE NO TRANSAKSI MATAUANG
    respond.sqlambil = "SELECT c.ckodenotransaksi FROM f1_currency c WHERE c.ckode = '" + matauang + "'";
    dt = await knex_select(respond.sqlambil);
    if (notEmpty(dt))
            mukodenotransaksi = dt[0].ckodenotransaksi;
            
    // 'AMBIL AWALAN, JMLDIGIT, NOBERIKUTNYA BERDASARKAN KODETABEL, CABANG, LOKASI, TAHUN, BULAN
    respond.sqlambil = "SELECT n.awalan, n.jmldigit, nb.noberikutnya FROM f0_nomor n JOIN f0_nomor_next nb ON n.kodetabel=SUBSTR(nb.kodetabel FROM 1 FOR length(nb.kodetabel) - length('" + mukodenotransaksi + "')) WHERE n.kodetabel='" + kodetabel + "' AND nb.kodetabel='" + kodetabel + mukodenotransaksi + "' AND nb.cabang='" + cabang + "' AND nb.lokasi='" + lokasi + "' AND nb.tahun='" + thn + "' AND nb.bulan='" + blnFilter + "'";
    dt = await knex_select(respond.sqlambil);
    if (notEmpty(dt))
    {
        awalan = dt[0].awalan + mukodenotransaksi;
        jmldigit = dt[0].jmldigit;
        noberikutnya = dt[0].noberikutnya + 1;

        // 'SET respond.sql
        respond.sql = "UPDATE f0_nomor_next SET noberikutnya = '" + noberikutnya + "' WHERE cabang='" + cabang + "' AND lokasi='" + lokasi + "' AND kodetabel='" + kodetabel + mukodenotransaksi + "' AND tahun='" + thn + "' AND bulan='" + blnFilter + "'";
    }
    else
    {
        // 'AMBIL AWALAN, JMLDIGIT BERDASARKAN KODETABEL
        sqlambil = "SELECT awalan, jmldigit FROM f0_nomor WHERE kodetabel='" + kodetabel + "'";
        dt = await knex_select(sqlambil);
        if (notEmpty(dt))
        {
            awalan = dt[0].awalan + mukodenotransaksi;
            jmldigit = dt[0].jmldigit;
            noberikutnya = 1;

            // 'SET respond.sql
            respond.sql = "Insert into f0_nomor_next (cabang, lokasi, kodetabel, tahun, bulan, noberikutnya) values('" + cabang + "', '" + lokasi + "', '" + kodetabel + mukodenotransaksi + "', " + thn + ", " + blnFilter + ", '2')";
        }
        else
        {
            respond.errmessage = "Could not find '" + kodetabel + "' in f0_nomor."; return respond
        }
    }

    // 'SET respond.notransaksi
    // 'coba Kawata
    if (awalan == "SQ" || awalan == "RI")
    {
        respond.notransaksi = (withCabang == 1) ? cabang : "";
        respond.notransaksi += (withLokasi == 1) ? lokasi : "";
        respond.notransaksi += (withTahun == 1) ? thn : "";
    }
    else
    {
        respond.notransaksi = (withCabang == 1) ? cabang : "";
        respond.notransaksi += (withLokasi == 1) ? lokasi : "";
        respond.notransaksi += (withSumber == 1) ? awalan : "";
        respond.notransaksi += (withTahun == 1) ? thn : "";
    }

    // 'SET BULAN respond.notransaksi
    if (withBulan == 1)
        if (notEmpty(bln))
            respond.notransaksi += bln;
        else
            respond.notransaksi += "0" + bln;

    // 'SET DIGIT respond.notransaksi
    digit = noberikutnya;
    for(i = digit.length + 1; i < digit.length ; jmldigit)
    {
        digit = "0" + digit;
    }

    respond.notransaksi += digit;

    respond.success = 1;

    return respond;
}

isEmpty = data =>
{
    if(!data)
        return true;

    switch(typeof data)
    {
        case 'NULL':return true;
        case 'object':
            if(Object.keys(data).length > 0)   
                return false;
            return true;
        case 'number':
            if(data > 0)   
                return false;
            return true;
        case 'array':
            if(data.length > 0)   
                return false;
            return true;
        case 'string': 
            if(data.length > 0)
                return false;
            else            
                return true;
        default: return true;
    }
}

notEmpty = (data) =>
{
    return !isEmpty(data);
}

FixQuotes = (text ='') =>
{
    return text.toString().replace("'", "''");
}

FixDouble = (text = '') =>
{
    return text.toString().replace(",", "."); //Replace koma menjadi titik
}

isContain = (data = '', cek = '') =>
{
    return data.includes(cek);
}

isDate = (param = '', nama = 'param') =>
{
    const val = validator({[nama]: [param]}, {[nama]: 'required|date'});

    respond = {};
    respond.success = val.success;
    respond.info = val.message;

    return respond;
}

function dateNow()
{
    const moment = require('moment');
    return moment().format("MM/DD/YYYY HH:mm:ss");
}

function validator(value, data)
{
    let msg = [];
    for (const key in data) {
        const arrValidator = data[key].split('|');
        for(const param in arrValidator) {
            const caseValidator = arrValidator[param];
            const val = (value && (value[key] || value[key] == 0)) ? value[key] : '';

            // required
            if(caseValidator == 'required' && !val && isEmpty(val) && val != 0)
                msg.push("The " + key + " is required.");

            // numeric, 1 4.5 6.8
            if(caseValidator == 'numeric' && isNaN(val))
                msg.push("The " + key + " must be a number.");

            // integer, 1 2 3 4 5
            if(caseValidator == 'integer' && !Number.isInteger(val))
                msg.push("The " + key + " must be a integer.");

            // date, 12/05/2018, 12/05/2018 20:56:45, 2015-06-22, 2015-06-22T13:17:21+0000
            if(caseValidator == 'date') {
                const moment = require('moment');
                if(!moment(val, [moment.ISO_8601,"MM/DD/YYYY","MM/DD/YYYY HH:mm:ss","YYYY-MM-DD H:mm:ss"], true).isValid())
                    msg.push(val + "The " + key + " is not a valid date.");
            }

            // digits_between, digits_between:2,5 digits_between:10,20
            if(caseValidator.indexOf("digits_between:") == 0) {
                const max = caseValidator.split("digits_between:")[1].split(",")[1];
                const min = caseValidator.split("digits_between:")[1].split(",")[0];
                if(!(val >= min && val <= max))
                    msg.push("The " + key + " must be between " + min + " and " + max + " digits.");
            }

            // max, max:5 max:25
            if(caseValidator.indexOf("max:") == 0) {
                const maxValue = caseValidator.split("max:")[1];
                var checkIsNaN = true;

                // if interger or numeric check count
                for(const paramMax in arrValidator) 
                    if((arrValidator[paramMax] == 'integer' || arrValidator[paramMax] == 'numeric') && maxValue < parseInt(val)) {
                        checkIsNaN = false;
                        msg.push("The " + key + " may not be greater than " + maxValue + ".");
                        break;
                    }
                
                // if string check character
                if(val && checkIsNaN && (maxValue < val.length || isNaN(maxValue))) 
                    msg.push("The " + key + " may not be greater than " + maxValue + " characters.");
            }

            // min, min:2 min: 20
            if(caseValidator.indexOf("min:") == 0) {
                const minValue = caseValidator.split("min:")[1];
                var checkIsNaN = true;

                // if interger or numeric check count
                for(const paramMin in arrValidator) 
                    if((arrValidator[paramMin] == 'integer' || arrValidator[paramMin] == 'numeric') && minValue > parseInt(val)) {
                        checkIsNaN = false;
                        msg.push("The " + key + " must be at least " + minValue + "." );
                        break;
                    }
                
                // if string check character
                if(val && checkIsNaN && (minValue > val.length || isNaN(minValue))) 
                    msg.push("The " + key + " must be at least " + minValue + " characters.");
            }
        }
    }
    
    return {
        'success': msg.length?false:true,
        'message': msg
    };
}

function get_date(date = '')
{
    date = date.split('-');

    return {
        year : date[0],
        month : date[1],
        day : date[2]};
}

checkContains = (columns, data) =>
{
    let bol = false
    columns = columns.replace(' ', '');
    arr = columns.split(',');
    arr.forEach(function(val){
        if(val == data) {
            bol = true
            return bol
    }});
    return bol
}

//  DataTable - Mengambil/mencari suatu nilai pada field tertentu. AsFilterDataTableX.AsDataTableDLookup
function AsDataTableDLookup(dt = '', StrField = '', StrFilter = '', NilaiJikaEOF = '')
{
    //  Filter datanya dan kembalikan nilai datanya sesuai field yg diminta
    if (notEmpty(StrFilter))
    {
        //  Proses dg filter
        for(const dc in dt)
        {
            for(const col in dt[dc])
            {
                const val = dt[dc][col];

                for(const arr in StrFilter)
                {
                    if(notEmpty(StrFilter[arr]) && StrFilter[arr].length == 2)
                        if((col == StrFilter[arr][0]) && (val == StrFilter[arr][1]))
                        {
                            return dt[dc][StrField];
                        }
                }
            }
        }
    }
    else
    {
        //  Proses tanpa filter
        if(notEmpty(dt))
            if(typeof dt == 'object')
            {
                if(notEmpty(dt[StrField]))
                    return dt[StrField];
            }
            else
                return dt[0][StrField];
    }

    return NilaiJikaEOF;
}

ValidasiMatauangCOA = async(DtMain, MainCurrencyField = '', MainArrayField = '', DtDetail, DetailArrayField = '', PemisahArray = "~", MainArrayFieldMessage = "",  DetailArrayFieldMessage = "", DetailUrutanField = "urutan") =>
{
    ErrMessage = ""; DtCoa = {}; DtValidasi = {};
    Filter = ""; Sql = ""; CurrField = ""; CurrFieldMessage = ""; Norek = "";
    valNorek = ""; valNama = ""; valMatauang = ""; valUrutan = "";

    //  'SET FIELD UTAMA ===================================================
    vMain = MainArrayField.split(PemisahArray);

    //  'SET FIELD MESSAGE UTAMA
    if (notEmpty(MainArrayFieldMessage))
        vMainMessage = MainArrayFieldMessage.split(PemisahArray);
    else
        vMainMessage = vMain;

    //  'VALIDASI JML FIELD UTAMA DAN FIELD MESSAGE UTAMA
    if (vMain.length != vMainMessage.length)
        return "Invalid MainArrayFieldMessage.";
    //  'END OF SET FIELD UTAMA ============================================

    //  'SET FIELD DETAIL ==================================================
    vDetail = DetailArrayField.split(PemisahArray);

    //  'SET FIELD MESSAGE DETAIL
    if (DetailArrayFieldMessage.length != 0)
        vDetailMessage = DetailArrayFieldMessage.split(PemisahArray);
    else
        vDetailMessage = vDetail;

    //  'VALIDASI JML FIELD DETAIL DAN FIELD MESSAGE DETAIL
    if (vDetail.length != vDetailMessage.length)
        return "Invalid DetailArrayFieldMessage.";
    //  'END OF SET FIELD DETAIL ===========================================

    //  'AMBIL MATAUANG FUNGSIONAL =========================================
    let dtMatauang = await knex_select("SELECT skode, snilai FROM f0_setting WHERE smodule = 0 AND sgrup = 'accounting' AND (skode = 'MataUangFungsional' OR skode = 'Kurs')");
    uangFungsional = AsDataTableDLookup(dtMatauang, "snilai", [['skode', 'MataUangFungsional']], "Not found");
    if (uangFungsional == "Not found")
        return "Setting Functional Currency not found.";

    kursFungsional = AsDataTableDLookup(dtMatauang, "snilai", [['skode', 'Kurs']], "Not found");
    if (kursFungsional == "Not found")
        return "Setting Exchange Rate Functional Currency not found.";
    //  'END OF AMBIL MATAUANG FUNGSIONAL ==================================


    //  'VALIDASI MATAUANG COA =============================================
    if (notEmpty(DtMain))
    {
        //  'SET MATAUANG UTAMA
        uangUtama = AsDataTableDLookup(DtMain, MainCurrencyField, "", "Not Found");

        // 'VALIDASI DATA UTAMA ----------------------------------
        if (notEmpty(MainArrayField) && notEmpty(vMain))
        {
            // 'PERULANGAN SEBANYAK FIELD UTAMA
            for(const val in vMain)
            {
                // 'SET NOREK
                Norek = DtMain[val];

                // 'SET FILTER COA
                Filter = (isEmpty(Filter))? "" : Filter + " OR ";
                Filter += " cnomor = '" + Norek + "' ";

                // 'VALIDASI KE DATABASE (f1_coa)
                // 'AMBIL NOREK YANG MEMILIKI MATAUANG <> MATAUANG FUNGSIONAL DAN <> MATAUANG UTAMA
                Sql = "SELECT cnomor, cnama, cmatauang FROM f1_coa ";
                Sql += " WHERE cmatauang <> '" + uangFungsional + "' AND cmatauang <> '" + uangUtama + "' ";
                Sql += " AND (" + Filter + ") ";
                DtCoa = await knex_select(Sql);

                // 'JIKA TERDAPAT DATA, MAKA TAMPILKAN ALERT
                if (notEmpty(DtCoa))
                {
                    // 'AMBIL NOREK, NAMA DAN MATAUANG DARI f1_coa
                    valNorek = DtCoa[0].cnomor;
                    valNama = DtCoa[0].cnama;
                    valMatauang = DtCoa[0].cmatauang;
                    // 'ErrMessage = "Main Transaction : Invalid COA Currency for column " . CurrFieldMessage . " on " . valNorek . " - " . valNama . " (" . valMatauang . ")." : GoTo selesai
                    return "Main Transaction : Invalid COA Currency on " + valNorek + " - " + valNama + " (" + valMatauang + ")."; 
                }

                // 'CLEAR FILTER
                Filter = "";
            }
        }
        // 'END OF VALIDASI DATA UTAMA ---------------------------

        // 'VALIDASI DATA DETAIL ---------------------------------
        if (notEmpty(DtDetail) && notEmpty(DetailArrayField) && notEmpty(vDetail))
        {
            // 'PERULANGAN SEBANYAK FIELD DETAIL
            for(const i in vDetail)
            {
                // 'SET FIELD DAN FIELD MESSAGE
                CurrField = vDetail[i]; CurrFieldMessage = vDetailMessage[i];

                // 'PERULANGAN SEBANYAK ROW DATA DETAIL
                for(const dr in DtDetail)
                {
                    // 'SET NOREK
                    Norek = dr[CurrField];

                    // 'SET FILTER COA
                    Filter = (isEmpty(Filter))? "": Filter + " OR ";
                    Filter += " cnomor = '" + Norek + "' ";
                }

                // 'VALIDASI KE DATABASE (f1_coa)
                // 'AMBIL NOREK YANG MEMILIKI MATAUANG <> MATAUANG FUNGSIONAL DAN <> MATAUANG UTAMA
                Sql = "SELECT cnomor, cnama, cmatauang FROM f1_coa ";
                Sql += " WHERE cmatauang <> '" + uangFungsional + "' AND cmatauang <> '" + uangUtama + "' ";
                Sql += " AND (" + Filter + ") ";
                DtCoa = await knex_select(Sql);

                // 'JIKA TERDAPAT DATA, MAKA TAMPILKAN ALERT
                if (notEmpty(DtCoa))
                {
                    // 'AMBIL NOREK, NAMA DAN MATAUANG DARI f1_coa
                    valNorek = DtCoa[0].cnomor;
                    valNama = DtCoa[0].cnama;
                    valMatauang = DtCoa[0].cmatauang;
                    // 'AMBIL URUTAN DARI DATA DETAIL
                    valUrutan = AsDataTableDLookup(DtDetail, DetailUrutanField, [[CurrField, valNorek]]);
                    // 'ErrMessage = "Detail Row - " . valUrutan . " : Invalid COA Currency for column " . CurrFieldMessage . " on " . valNorek . " - " . valNama . " (" . valMatauang . ")." : GoTo selesai
                    ErrMessage = "Detail Row - " + valUrutan + " : Invalid COA Currency on " + valNorek + " - " + valNama + " (" + valMatauang + ").";
                }

                // 'CLEAR Variabel
                Filter = "";
            }

        }
        // 'END OF VALIDASI DATA DETAIL --------------------------
    }
    else
    {
        return "Main transaction not found.";
    }
    //  'END OF VALIDASI MATAUANG COA ======================================

    return ErrMessage;
}

M0_DeleteNotransaksi = async(cabang, lokasi, kodetabel, tgl, notransaksi, sumber = "", smodule = 0, matauang = "") =>
{
    let respond = {};
    respond.success = false;
    respond.errmessage = "";
    mukodenotransaksi = "";
    awalan = ""; withLokasi = "1";
    sqlambil = ""; sql = "";
    success = 0; jmldigit = 0; noberikutnya = 0;
    errmessage = ""; rsSetting = "";
    sgrup = (smodule == 0) ? "accounting" : "options";

    //  AMBIL SETTING, PAKAI CABANG ATAU TIDAK
    rsSetting = F_getSetting(smodule, sgrup, sumber + "NoTransactionCabang");
    withCabang = (notEmpty(rsSetting)) ? rsSetting : 1;
    if (withCabang != 1) cabang = "--";

    // 'AMBIL SETTING, PAKAI LOKASI ATAU TIDAK
    rsSetting = F_getSetting(smodule, sgrup, sumber + "NoTransactionLokasi");
    withLokasi = (notEmpty(rsSetting)) ? rsSetting : 1;
    if (withLokasi != 1) lokasi = "--";

    // 'AMBIL SETTING, PAKAI BULAN ATAU TIDAK
    rsSetting = F_getSetting(smodule, sgrup, sumber + "NoTransactionPeriode");
    resetBulan = (notEmpty(rsSetting)) ? rsSetting : 1;

    if (withLokasi == 1)
    {
        // 'AMBIL KODE TRANSAKSI LOKASI
        sqlambil = "SELECT lkodetransaksi FROM f1_location WHERE lkode = '" + lokasi + "'";
        dt = await knex_select(sqlambil);
        if (notEmpty(dt))
            lokasi = dt[0].lkodetransaksi;
        else
        {
            respond.errmessage = "Could not find Transaction Code for '" + lokasi + "' location."; return respond;
        }
    }

    // 'AMBIL KODE NO TRANSAKSI MATAUANG
    sqlambil = "SELECT c.ckodenotransaksi FROM f1_currency c WHERE c.ckode = '" + matauang + "'";
    dt = await knex_select(sqlambil);
    if (notEmpty(dt))
        mukodenotransaksi = dt[0].ckodenotransaksi;

    // 'FORMAT TGL
    if (resetBulan != 1)
    {
        getdate = get_date(tgl);
        tgl = getdate.year + '-01-' + getdate.day;
    }

    // 'AMBIL NOMORBERIKUTNYA DARI f0_nomor_next BERDASARKAN :
    // 'KODETABEL, LOKASI, TAHUN DAN BULAN TRANSAKSI
    sqlambil = "  SELECT noberikutnya FROM f0_nomor_next";
    sqlambil += " WHERE kodetabel = '" + kodetabel + mukodenotransaksi + "'";
    sqlambil += " AND lokasi = '" + lokasi + "'";
    sqlambil += " AND cabang = '" + cabang + "'";
    sqlambil += " AND tahun = RIGHT(YEAR('" + tgl + "'), 2)";
    sqlambil += " AND bulan = MONTH('" + tgl + "')";
    dt = await knex_select(sqlambil);
    if (notEmpty(dt))
        noberikutnya = parseInt(dt[0].noberikutnya);

    // 'AMBIL JMLDIGIT DARI F0_NOMOR BERDASARKAN KODETABEL
    sqlambil = " SELECT jmldigit FROM f0_nomor";
    sqlambil += " WHERE kodetabel = '" + kodetabel + "'";
    dt = await knex_select(sqlambil);
    if (notEmpty(dt))
        jmldigit = parseInt(dt[0].jmldigit);

    // 'JIKA URUTAN NO.TRANSAKSI = NOMORBERIKUTNYA - 1 MAKA UPDATE f0_nomor_next
    // if ( strlen(notransaksi)-jmldigit == strlen(noberikutnya) - 1)
    // {
        sql = "  UPDATE f0_nomor_next SET noberikutnya = noberikutnya - 1";
        sql += " WHERE kodetabel = '" + kodetabel + mukodenotransaksi + "'";
        sql += " AND lokasi = '" + lokasi + "'";
        sql += " AND cabang = '" + cabang + "'";
        sql += " AND tahun = RIGHT(YEAR('" + tgl + "'), 2)";
        sql += " AND bulan = MONTH('" + tgl + "')";
    // }

    respond.success = true;
    respond.errmessage = errmessage;
    respond.notransaksi = notransaksi;
    respond.sql = sql;
    return respond;
}

// FUNGSI UNTUK VALIDASI AKUN WAJIB COSTCENTER ATAU TIDAK
ValidasiCoaRequiredCostCenter = async(strFilter = '', dtdetail = '') =>
{
    // 'CEK COA WAJIB COST CENTER ==============================
    dtCekCC = await knex_select("SELECT cnomor, cnama FROM f1_coa WHERE ccostcenter = 1 AND (" + strFilter + ")");
    if (notEmpty(dtCekCC))
        for(const dr1 in dtCekCC)
        {
            dtDetailCC = AsDataTableDLookup(dtdetail, "urutan", [['norek', dr1.cnomor], ['costcenter', '']], "Not found");
            if (notEmpty(dtDetailCC))
                return "Row " + dtDetailCC + " : " + dr1.cnomor + " " + dr1.cnama + " - cost center can't be empty.";
        }
    
    // 'END OF CEK COA WAJIB COST CENTER =======================

    return "";
}


//  DataTable - Menghitung jml nilai (sum) pada suatu datatable
AsDataTableDSum = (dt, StrField) =>
{
    let sum = 0;
    for(const val in dt)
        if(notEmpty(dt[val][StrField]))
            sum += dt[val][StrField]; 

    return sum;
}

// 'FUNGSI UNTUK AMBIL SETTING
F_getSetting = async(sModule, sGrup, sKode) =>
{
    sql = "SELECT snilai FROM f0_setting WHERE smodule = '" + sModule + "' AND sgrup = '" + sGrup + "' AND skode = '" + sKode + "'";
    dtSetting = await knex_select(sql);
    if(notEmpty(dtSetting))
        if (notEmpty(dtSetting[0].snilai))
            return dtSetting[0].snilai;

    return '';
}

insertHistory = async(t, table, primaryKey, primaryKeyDetail, notransaksi, idtransaksi) =>
{
    await t.raw(`INSERT INTO ${table}_history(SELECT 0, fix.* FROM ${table} fix WHERE fix.${primaryKey} = ${idtransaksi})`);
    await t.raw(`INSERT INTO ${table}_detail_history (SELECT 0, 123, fix.* FROM ${table}_detail fix WHERE fix.${primaryKeyDetail} = ${idtransaksi} )`);
}

function validatorGet(data)
{
    if(data && data.query && data.query.param && JSON.parse(data.query.param))
        return validator(JSON.parse(data.query.param), {
            'target'              : 'required',
            'pageNumber'          : 'required|numeric|min:1',
            'pageLimit'           : 'required|numeric|min:1|max:50',
        });
    else
        return '';
}

function kill(res, send, code)
{
    res && send.code && res.status(send.code);
    res && code && res.status(code);
    res && send && res.send(send);
}

function setGroupBy(db, groupBy)
{
    if(!isEmpty(groupBy))
    {
        if(typeof groupBy == "array")
        {
            for(const field in groupBy)
            {
                db = db.groupBy(field);
            }
        }
        else
        {
            db = db.groupBy(groupBy);
        }
    }

    return db;
}

function setOrderBy(db, orderBy)
{
    if(!isEmpty(orderBy))
    {
        db = db.orderByRaw(orderBy);
    }

    return db;
}

function caseOperator(operator, column, value)
{
    switch(operator)
    {
        case 'contains': return column + " LIKE '%" + value + "%'";
        case 'begin with': return column + " LIKE '" + value + "%'";
        case 'end with': return column + " LIKE '%" + value + "'";
        default: return column + " " + operator + " '" + value + "'";
    }
}

knex_select = async query => {
    let respond = await knex.raw(query)
    return respond[0]
}

function replaceAll(string, search, replace) 
{
    return string.split(search).join(replace);
}

class Global_help  
{
    validator(reqData, data)
    {
        validator = make(reqData, data);

        if (validator.fails()) 
            return [false, validator.messages().all(), 409];
        
        return [true];
    }
    
    insertDataResIndex(table, value)
    {        
        result =  table(table).insertGetId(value);
        response = {'success' : true, 'id' : result};
        return response;
    }
    
    hakAkses = async(ModuleId = 2, MenuId = 1, IndeksAkses = 0, UserId = 1) =>
    {    
        let arrNamaAkses = ["Insert", "Update/Draft", "Delete", "GetData", "Approved1", "Approved2", "Approved3", "Approved4", "Approved", "Close/Unclose", "Journal", "History", "Setting Grid"];
    
        //CEK HAK AKSES =======================================
        let sql = "SELECT ur.userid, ur.role, rm.rmmoduleid, rm.rmmenuid, rm.rmrole, rm.rmakses, rm.rmfavourite FROM f0_user_role ur JOIN f0_role_menu rm ON ur.role = rm.rmrole WHERE ur.userid = '" + FixDouble(UserId) + "' AND rm.rmmoduleid = '" + FixDouble(ModuleId) + "' AND rmmenuid = '" + FixDouble(MenuId) + "'";
        let dt = await knex.raw(sql);
        if(dt.length > 0)
        {
            dt = dt[0]
            // JIKA AKSES <> 1 MAKA ALERT TIDAK MEMPUNYAI HAK AKSES
            if(dt[0].rmakses.toString().substr(IndeksAkses-1, IndeksAkses) == '0')
                return "This role doesn't have permission to '" + arrNamaAkses[IndeksAkses] + "' this menu.";
        }
        else
        {
            return "This role doesn't have permission to '" + arrNamaAkses[IndeksAkses] + "' this menu.";
        }

        return '';
    }
    
    F2_Accounting_PeriodeCheck = async(tglAwal = '', tglAkhir = '') =>
    {
        let success = 0; 
        let errmessage = ""; 
        let filter = "";
          
        //  CEK TIPE DATA =============================================
        let cekTipeData = isDate(tglAwal, 'tglAwal');
        if (!cekTipeData.success) 
        {
            errmessage = cekTipeData.info;return errmessage;
        }
        // else
            // tglAwal = AsFormatTanggal(tglAwal);

        cekTipeData = isDate(tglAkhir, 'tglAkhir');
        if (!cekTipeData.success) 
        {
            errmessage = cekTipeData.info;return errmessage;
        }
//         Else
//             tglAkhir = AsFormatTanggal(tglAkhir)
//         End If
        //  END OF CEK TIPE DATA ======================================

        //  BUAT FILTER ===============================================
        let awal = get_date(tglAwal);
        let akhir = get_date(tglAkhir);
        //  jika tahun berbeda
        if (awal.year != akhir.year) 
        {
            filter = "((aptahun = '" + awal.year + "' AND apbulan >= '" + awal.month + "') or (aptahun > '" + awal.year + "' AND aptahun < '" + akhir.year + "') or (aptahun = '" + akhir.year + "' AND apbulan <= '" + akhir.month + "'))";
            //  jika tahun sama
        }        
        else if (awal.year == akhir.year) 
        {
            //  jika bulan sama
            if (awal.month == akhir.month) 
                filter = "((aptahun = '" + awal.year + "') AND (apbulan = '" + awal.month + "'))";
            //  jika bulan beda
            else
                filter = "((aptahun = '" + awal.year + "') AND (apbulan BETWEEN '" + awal.month + "' AND '" + akhir.month + "'))";
        }
        //  END OF BUAT FILTER ========================================


        // 'CEK PERIODE AKUNTANSI SUDAH TUTUP/BELUM
        let dt = await knex.raw("SELECT aptahun, apbulan FROM f2_accounting_period WHERE " + filter + " AND aptutupperiode = '1'");
        if (dt.length > 0) 
        {
            success = 0; 
            errmessage = "Accounting Periode : Year = '" + dt[0][0] + "', Month = '" + dt[0][1] + "' has closed." ; 
            return errmessage;
        }

        success = 1;
        return json_decode('{"success":"'+ success +'", "errmessage":"' + errmessage + '"}');
    }
}

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  

class ModelsDB
{

    constructor(table = '')
    {
        this.select = '*';
        this.selectFormatDate = '';
        this.where = '';
        this.groupBy = '';
        this.orderBy = '';
        this.pageLimit = '';
        this.pageNumber = '';
        this.arrJoin = [];
        this.arrLeftJoin = [];
        this.result = '';
        this.table = table;
            
        this.getData = async(where = '', groupBy = '', orderBy = '', pageLimit = 1, pageNumber = 20) =>
        {
            // Set Variabel
            this.where = where;
            this.groupBy = groupBy;
            this.orderBy = orderBy;
            this.pageLimit = pageLimit;
            this.pageNumber = pageNumber;

            // Deklarasi Tabel
            let db = knex(this.table);
            for(const val in this.arrJoin)
            {
                db = db.join(val[0], val[1], val[2], val[3]);
            }

            for(const val in this.arrLeftJoin)
            {
                db = db.leftJoin(val[0], val[1], val[2], val[3]);
            }

            // Select Data
            if(!isEmpty(this.select))
            {
                db = db.select(knex.raw(this.select));
            }

            // Filter
            if(!isEmpty(this.where))
                db = db.whereRaw(this.where);
            
            // Group By
            db = setGroupBy(db, this.groupBy);

            // Order By
            db = setOrderBy(db, this.orderBy);
            
            // Paginate
            var returnData  = await db.clone().paginate({perPage: this.pageLimit, currentPage: this.pageNumber, isLengthAware: true });
            
            if(returnData.pagination.currentPage > returnData.pagination.lastPage)
            {
                returnData = await db.paginate({perPage: this.pageLimit, currentPage: 1, isLengthAware: true });
            }
            
            // Format Date 
            if(this.selectFormatDate != '')
            {
                var selectDate = this.selectFormatDate.split(' '). join('');
                selectDate = selectDate.split(',');

                for(const row in returnData.data)
                    for(const format in selectDate)
                        if(returnData.data[row][selectDate[format]] != "")
                            returnData.data[row][selectDate[format]] = formatDate(returnData.data[row][selectDate[format]]);
            }

            this.result = returnData;
            return this.result; 
        }

        
        this.getDataById = async(primary_key = '', value = '') =>
        {
            // Deklarasi Tabel
            let db = knex(this.table);

            // Select Data
            if(!isEmpty(this.select))
                db = db.select(knex.raw(this.select));

            // Filter
            db = db.where(primary_key, value);
            
            var returnData = await db.catch(function(err) {
               return {success: false, message: err.stack.split('\n')[0], messageDev: err.stack.split('\n')};
            })

            // Manipulasi Format Date 
            if(returnData && !isEmpty(this.selectFormatDate))
            {
                var selectDate = this.selectFormatDate.split(' '). join('');
                selectDate = selectDate.split(',');
        
                for(const row in returnData.data)
                    for(const format in selectDate)
                        if(returnData.data[row][selectDate[format]] != "")
                        returnData.data[row][selectDate[format]] = formatDate(returnData.data[row][selectDate[format]]);
            }
            return returnData; 
        }

        this.checkDataById = async(table, primary_key, value) =>
        {        
            return await knex(table).where(primary_key, value).first().then( function( resp ){
                return {success: true, message: resp};
            }).catch(function(err) {
               return {success: false, message: err.stack.split('\n')[0], messageDev: err.stack.split('\n')};
            })
        }

        this.updateData = async(table, primary_key, value, data) =>
        {   
            return await knex(table).where(primary_key, value).update(data).then( function( resp ){
                return {success: true, message: resp};
            }).catch(function(err) {
               return {success: false, message: err.stack.split('\n')[0], messageDev: err.stack.split('\n')};
            })
        }
    
        this.deleteData = async(table, primary_key, value) =>
        {        
            return await knex(table).where(primary_key, value).delete().then( function( resp ){
                return {success: true, message: resp};
            }).catch(function(err) {
               return {success: false, message: err.stack.split('\n')[0], messageDev: err.stack.split('\n')};
            })
        }
        
        this.insertData = async(table, value) =>
        {        
            return await knex(table).insert(value).then( function( resp ){
                return {success: true, message: resp};
            }).catch(function(err) {
               return {success: false, message: err.stack.split('\n')[0], messageDev: err.stack.split('\n')};
            })
        }
    }
    
    join(tableJoin = '', column = '', operator = '', value = '')
    {
        array_push(this.arrJoin, [tableJoin, column, operator, value]);
    }
    
    leftJoin(tableJoin = '', column = '', operator = '', value = '')
    {
        array_push(this.arrLeftJoin, [tableJoin, column, operator, value]);
    }
    
    select(data = '')
    {
        this.select = data;
    }
    
    selectFormatDate(data = '')
    {
        this.selectFormatDate = data;
    }


}

class Helpfix  
{
    constructor(param) 
    {
        this.data = '';
        this.target = '';
        this.line = 0;
        this.source = 'Area';
        this.desc = '';
        this.detail = '';
        this.code = 404;
        this.status = false;
        this.msguser = '';
        this.func = param;
        this.filename = '';

        this.string = () => 
        {
            return {send:this.data, status:201};
        }

        this.success = () => 
        {
            this.code = 201;
            this.status = true;
    
            return this.done();
        }

        this.done = () => 
        {
            let respond; 
            if(this.status)
            {
                respond = {
                    'success'    : true,
                    'data'      : this.data,
                    'target'    : this.target,
                };
            }
            else
            {
                this.detail = this.detail == "" ? {} : {detail: this.detail};
                respond = {
                    'success'    : this.status,
                    'data'      : this.data,
                    'target'    : this.target,
                    'code'      : this.code,
                    'msguser'   : this.msguser,
                    'msgdev'    : {
                        'line'      : this.line,
                        'filename'  : this.filename,
                        'function'  : this.func, ...this.detail,
                        'desc'      : this.desc, 
                    },
                };
            }
    
            return {send:respond, status:this.code};
        }

        this.fail = (message = null, code = null, messageDev = null, line = null, filename = null, t = null) => 
        {
            t && t.rollback()
            this.msguser = message ? message : this.msguser;
            if(this.msguser == "JsonWebTokenError: invalid signature") {
                this.msguser = "Your credential is wrong"
            } else {
                this.desc = messageDev?messageDev:this.messageDev;
                this.code = code?code:409;
                this.line = line ? line : this.line;
                this.filename = filename ? filename : this.filename;
                this.status = false;
                this.data = "";
            }
    
            return this.done();
        }   
    }
    
    
 
}

module.exports = { Helpfix, ModelsDB, Global_help,
    formatDate, strToArray, isEmpty, notEmpty, FixQuotes, FixDouble, isContain, isDate, validator, get_date, checkContains, 
    AsDataTableDLookup, ValidasiMatauangCOA, M0_DeleteNotransaksi, ValidasiCoaRequiredCostCenter, AsDataTableDSum, F_getSetting,
    insertHistory, validatorGet, validatorGet, setGroupBy, setOrderBy, caseOperator, tc, replaceAll, knex_select, M0_Notransaksi,
    q, M2_Accounting_PeriodeCheck
};