// TRANSACTION INSERT
const insert = async(req) => {
    // Validator var main
    const result = help.validator(req.body, {
        "userid"    : "required|numeric|min:0|max:255",
        "isUpdate"  : "required|numeric|min:0|max:1",
        "target"    : "required",
        "main"     : "required",
        "detail"    : "required",
    });
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);
            
    const resultMain = help.validator(req.body.main, {
        'crid'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
        'crcabang'   : 'required|max:25',
        'crlokasi'   : 'required|max:25',
        'crsumber'   : 'required|max:10',
        'crautonotransaksi'   : 'required|numeric|min:-127|max:127',
        'crnotransaksi'   : 'required|max:50',
        'crtgl'   : 'required|date',
        'crkodepa'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
        'crkontak'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
        'crkontakperson'   : 'max:100',
        'crnorek'   : 'required|max:25',
        'cruraian'   : 'max:250',
        'crcatatan'   : 'max:250',
        'crmatauang'   : 'required|max:25',
        'crkurs'   : 'required|numeric',
        'crjumlah'   : 'required|numeric',
        'crjumlahvalas'   : 'required|numeric',
        'crjumlahbayar'   : 'required|numeric',
        'crjumlahbayarvalas'   : 'required|numeric',
        'crstatusbayar'   : 'required|numeric|min:-127|max:127',
        'crtgllunas'   : 'date',
        'crstatus'   : 'required|numeric|min:-127|max:127',
        'crstatussebelumnya'   : 'required|numeric|min:-127|max:127',
        'crjmlrevisi'   : 'required|numeric|min:-2147483647|max:2147483647',
        'crcetakanke'   : 'required|numeric|min:-127|max:127',
        'crisclose'   : 'required|numeric|min:-2147483647|max:2147483647',
        'crinputuser'   : 'numeric|min:-9223372036854775808|max:9223372036854775808',
        'crinputtgl'   : 'required|date',
        'crmodifikasiuser'   : 'numeric|min:-9223372036854775808|max:9223372036854775808',
        'crmodifikasitgl'   : 'required|date',
        'crposting'   : 'required|numeric|min:-127|max:127',
        'crpostingtgl'   : 'required|date',
        'crcustomtext1'   : 'max:250',
        'crcustomtext2'   : 'max:250',
        'crcustomtext3'   : 'max:250',
        'crcustomtext4'   : 'max:250',
        'crcustomtext5'   : 'max:250',
        'crcustomint1'   : 'required|numeric|min:-2147483647|max:2147483647',
        'crcustomint2'   : 'required|numeric|min:-2147483647|max:2147483647',
        'crcustomint3'   : 'required|numeric|min:-2147483647|max:2147483647',
        'crcustomdbl1'   : 'required|numeric',
        'crcustomdbl2'   : 'required|numeric',
        'crcustomdbl3'   : 'required|numeric',
        'crcustomdate1'   : 'required|date',
        'crcustomdate2'   : 'required|date',
        'crcustomdate3'   : 'required|date',
    });
    if(!resultMain.success) return res.fail(resultMain.message, 406, resultMain.messageDev, __line, __filename)
            
    const detail = req.body.detail
    let dataErr = []
    for (const key in detail) {
        let resultDetail = help.validator(detail[key], {
            'idcrdetail'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
            'idcr'   : 'required|numeric|min:-9223372036854775808|max:9223372036854775808',
            'norek'   : 'required|max:25',
            'matauang'   : 'required|max:25',
            'kurs'   : 'required|numeric',
            'jumlah'   : 'required|numeric',
            'jumlahvalas'   : 'required|numeric',
            'catatan'   : 'max:250',
            'costcenter'   : 'max:25',
            'divisi'   : 'max:25',
            'subdivisi'   : 'max:25',
            'proyek'   : 'max:25',
            'urutan'   : 'required|numeric|min:-2147483647|max:2147483647',
            'isclose'   : 'required|numeric|min:-2147483647|max:2147483647',
            'customtext1'   : 'max:250',
            'customtext2'   : 'max:250',
            'customtext3'   : 'max:250',
            'customdbl1'   : 'required|numeric',
            'customdbl2'   : 'required|numeric',
            'customdbl3'   : 'required|numeric',
            'customdate1'   : 'required|date',
            'customdate2'   : 'required|date',
            'customdate3'   : 'required|date',
        });
        !resultDetail.success && dataErr.push({row: (dataErr.length + 1), message: resultDetail.message})
    }
    if(dataErr.length > 0) return res.fail(dataErr, 406, '', __line, __filename);

    userid     = req.body.main.userid;
    isUpdate   = req.body.main.isUpdate;
    res.target = req.body.main.target;

    return res.success();
}
    
module.exports = {
    app: app => {
        app.post('/f2/cr/insert', async(req, result) => {
            let respond
            try {
                respond = await insert(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
    }    
};