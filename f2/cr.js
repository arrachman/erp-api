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
            
    let detail = req.body.detail
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

    let main = req.body.main
    userid     = req.body.userid;
    isUpdate   = req.body.isUpdate;
    res.target = req.body.target;

    // "*** Start Transaction ***"  
    let t = await knex.transaction();

    //  CEK HAK AKSES STATUS ============================
    vAkses = 0; msgAkses = "";
    //  MODUL DAN MENU HARUS DISESUAIKAN
    vModuleId = 2; vMenuId = 3;
    switch(main.crstatus)
    {
        case 0: vAkses = 0; break;
        case 1: vAkses = 0; break;
        case 2: vAkses = 8; break;
        case 3: vAkses = 0; break;
        case 4: vAkses = 0; break;
        case 5: vAkses = 0; break;
        case 6: vAkses = 0; break;
        case 7: vAkses = 0; break;
        case 8: vAkses = 4; break;
        case 9: vAkses = 5; break;
        case 10: vAkses = 6; break;
        case 11: vAkses = 7; break;
        case 12: vAkses = 0; break;
    }
    
    const Global_help = new help.Global_help()
    const cekAkses = await Global_help.hakAkses(vModuleId, vMenuId, vAkses, userid);
    if(cekAkses.length > 0) return res.fail(cekAkses, 406, '', __line, __filename, t);
    //  END OF CEK HAK AKSES STATUS =====================

    //  CEK PERIODE AKUNTANSI ==================================
    const rsCekPeriode = await Global_help.F2_Accounting_PeriodeCheck(main.crtgl, main.crtgl);
    if(rsCekPeriode.success == false) return res.fail(rsCekPeriode.errmessage, 406, '', __line, __filename, t);
    //  END OF CEK PERIODE AKUNTANSI ===========================

    // "CEK MATAUANG COA =======================================
    const rsCekCoa = await ValidasiMatauangCOA(main, "crmatauang", "crnorek", detail, "norek");
    if(notEmpty(rsCekCoa)) return res.fail(rsCekCoa, 406, '', __line, __filename, t);
    // "END OF CEK MATAUANG COA ================================

    // "CEK COA WAJIB COST CENTER ==============================
    if (main.crstatus == 2)
    {
        let strRekCostCenter
        for (key in detail)
        {
            strRekCostCenter = (isEmpty(strRekCostCenter))? "": `${strRekCostCenter} OR `;
            strRekCostCenter += ` cnomor = '${detail[key].norek}' `;
        }
        cekCoaCostCenter = ValidasiCoaRequiredCostCenter(strRekCostCenter, detail);
        if(notEmpty(cekCoaCostCenter)) return res.fail(cekCoaCostCenter, 406, '', __line, __filename, t);
    }
    // "END OF CEK COA WAJIB COST CENTER =======================

    // "HITUNG TOTAL BERDASARKAN DATA DETAIL ===================
    main.crjumlah = AsDataTableDSum(detail, "jumlah");
    main.crjumlahvalas = AsDataTableDSum(detail, "jumlahvalas");
    // "END OF HITUNG TOTAL BERDASARKAN DATA DETAIL ============

    res.data = {}
    if(isUpdate == false) {
        if(main.crautonotransaksi) {
            // "GENERATE NOTRANSAKSI =========================================
            rsNotransaksi = await M0_Notransaksi(t, main.crcabang, main.crlokasi, main.crsumber, main.crtgl, main.crsumber, 2);
            // cek success generate notransaksi
            if(rsNotransaksi.success == 1) {
                notransaksi = rsNotransaksi.notransaksi;
                // "tambah query update m0_nomor_next
                await t.raw(rsNotransaksi.sql)
            } else
                return res.fail(rsNotransaksi.errmessage, 406, '', __line, __filename, t);
            // "END OF GENERATE NOTRANSAKSI ==================================
        } else
            notransaksi = main.crnotransaksi;

        // "CEK NO TRANSAKSI ======================
        dtCekNo = await t.raw(`SELECT COUNT(crid) as jml FROM f2_cr WHERE crnotransaksi='${notransaksi}'`);
        cekNo = dtCekNo[0][0].jml;
        if (cekNo > 0) return res.fail(`No. : '${notransaksi}' - has been used.`, 406, '', __line, __filename, t);
        // "END OF CEK NO TRANSAKSI ===============

        get_col = ""; get_val = "";
        main.crnotransaksi = notransaksi;
        colNotContains = "crid";
        colDate = 'crtgl, crtgllunas, crinputtgl, crmodifikasitgl, crpostingtgl, crcustomdate1, crcustomdate2, crcustomdate3';
        for(const col in main)
        {
            if(checkContains(colNotContains, col) == false)
            {
                get_col += col + `, `;

                get_val += `'${FixQuotes(main[col])}', `;
            }
        }
        get_col = get_col.substring(0, get_col.length-2);
        get_val = get_val.substring(0, get_val.length-2);

        sql = `INSERT INTO f2_cr (${get_col}) VALUES (${get_val})`;
        await t.raw(sql);

        // Sql disesuaikan sendiri, untuk parameternya disesuaikan sendiri.
        sql = `select crid as transaksi from f2_cr where crnotransaksi='${notransaksi}' AND crinputuser= '${userid}' order by crmodifikasitgl desc limit 1`;
        dt2 = await t.raw(sql);

        if(notEmpty(dt2[0])) 
            idtransaksi = dt2[0][0].transaksi;
        else
            return res.fail("Main transaction data not found.", 406, '', __line, __filename, t);
    } else {
        idtransaksi = main.crid;
        notransaksi = main.crnotransaksi;

        // 'JIKA UPDATE CEK JML ROW PADA DATABASE
        dtupdate = await t.raw("SELECT COUNT(crid) as jml, crnotransaksi FROM f2_cr WHERE crid='" + idtransaksi + "' AND crstatus NOT IN(2,3,4,7)");
        rowUpdate = dtupdate[0][0].jml;

        if (notEmpty(rowUpdate))
        {
            if (main.crautonotransaksi == 1 && notransaksi == "Auto")
            {
                // 'GENERATE NOTRANSAKSI =========================================
                rsNotransaksi = M0_Notransaksi(t, main.crcabang, main.crlokasi, main.crsumber, main.crtgl, main.crsumber, 2);
                // cek success generate notransaksi
                if (rsNotransaksi.success == 1)
                {
                    notransaksi = rsNotransaksi.notransaksi;
                    // 'tambah query update m0_nomor_next
                    await t.insert(rsNotransaksi.sql);
                }
                else
                {
                    return res.fail(rsNotransaksi.errmessage, 406, '', __line, __filename, t);
                }
                // 'END OF GENERATE NOTRANSAKSI ==================================
            }

            // 'CEK NO TRANSAKSI ======================
            if (notransaksi != dtupdate[0].crnotransaksi)
            {
                dtCekNo = await t.raw(`SELECT COUNT(crid) as jml FROM f2_cr WHERE crnotransaksi=${notransaksi}`);
                cekNo = dtCekNo[0][0].jml;
                if (notEmpty(cekNo))
                {
                    return res.fail("No. : 'notransaksi' - has been used.", 406, '', __line, __filename, t);
                }
            }
            // 'END OF CEK NO TRANSAKSI ===============

            // 'SIMPAN HISTORY ========================
            insertHistory(t, 'f2_cr', 'crid', 'idcr', notransaksi, idtransaksi);
            // 'END OF SIMPAN HISTORY ==================
            
            get_val = '';
            main.crnotransaksi = notransaksi;
            colNotContains = 'crid';
            colDate = 'crtgl, crtgllunas, crinputtgl, crmodifikasitgl, crpostingtgl, crcustomdate1, crcustomdate2, crcustomdate3';
            for(const col in main)
            {
                if(!checkContains(colNotContains, col))
                {
                    get_val += col + " = '" + FixQuotes(val) + "', ";
                }
            }
            get_val = substr(get_val, 0, strlen(get_val)-2);

            sql = "UPDATE f2_cr SET get_val WHERE crid = 'main.crid'";
            await t.raw(sql)
        }
        else
        {
            return res.fail(`Can't update No. : '${notransaksi}' - it has been approved.`, 406, '', __line, __filename, t);
        }
    }

    res.data.idtransaksi = idtransaksi;
    res.data.notransaksi = notransaksi;

    // 'Hapus detail ketika update
    if (isUpdate)
    {
        sql = `DELETE FROM f2_cr_detail where idcr = ${idtransaksi}`;
        await t.raw(sql)
    }

    // 'Proses detail
    colNotContains = "idcrdetail, idcr";
    get_col = ''; get_val = '';
    for(const [i, arr] of Object.entries(detail))
    {
        get_val += '(';
        arr.idcr = idtransaksi;
        for(const [col, val] of Object.entries(arr))
        {
            if(!checkContains(colNotContains, col))
            {
                if(i == 0)
                    get_col += col + ", ";

                get_val += "'"+ FixQuotes(val) +"', ";
            }
            else
            {
                if(col == 'idcr')
                {				
                    if(i == 0)
                        get_col += col + ", ";

                    get_val += `${idtransaksi}, `;
                }						
            }
        }

        if(i == 0)
            get_col = get_col.substring(0, get_col.length-2);
        get_val = get_val.substring(0, get_val.length-2) + "), ";
    }
    get_val = get_val.substring(0, get_val.length-2)
    sql = `INSERT INTO f2_cr_detail(${get_col}) VALUES ${get_val}`; 
    await t.raw(sql);

    // 'INSERT MSMQ JURNAL =================================================================
    sumber = "cr"; mdlid = 0; mnid = 0; jnsaktivitas = 0;
    if (main.crstatus == 2)
    {
        // 'BUAT ID UNIQUE
        mjid = 'Security.MD5Cal)' + notransaksi; //RandomId.Generate(15)

        // 'MSMQ TABEL
        VALUES = "'" + mjid + "', '" + sumber + "', '" + idtransaksi + "', '" + 0 + "', " + "''" + ", NOW(), '1971-01-01 00:00:00', '" + userid + "'";
        sql = "INSERT INTO f0_Msmq_Journal(mjid, mjsumber, mjidtransaksi, mjprogress, mjpesan, mjtglantrian, mjtglselesai, mjuserid) VALUES ("+ VALUES +")";
        // DB::insert(sql);

        // 'MSMQ ANTRIAN
        PostingJurnal = await F_getSetting(0, "accounting", "AutoPosting");
        if (PostingJurnal == 1)
        {
            // hasilMsmq = SendMsmq(dirMsmq, "J", mjid, sumber, idtransaksi, userid);
            // if (notEmpty(hasilMsmq))
            // {
            //     res.fail(hasilMsmq); DB::rollBack(); goto selesai;
            // }
        }
    }
    // 'END OF INSERT MSMQ JURNAL ==========================================================


    // 'INSERT USER LOG ====================================================================
    // 'ambil moduleid dan menuid dari m0_nomor
    dtnomor = await t.raw("SELECT moduleid, menuid FROM f0_nomor WHERE kodetabel='" + sumber + "'");
    if (notEmpty(dtnomor[0])) 
    {
        mdlid = dtnomor[0][0].moduleid; 
        mnid = dtnomor[0][0].menuid;
    }
    else
    {
        return res.fail("Can't find '" + sumber + "' in M0_Nomor.", 406, '', __line, __filename, t);
    }

    // 'jika update jnsaktivitas = 14, jika insert : jnsaktivitas = 13
    if (isUpdate) jnsaktivitas = 14; else jnsaktivitas = 13;

    VALUES = userid + ", " + mdlid + ", " + mnid + ", " + jnsaktivitas + ", '" + notransaksi + "', NOW(), " + 0 ;
    sql = "INSERT INTO f0_userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) VALUES("+ VALUES +")";
    await t.raw(sql);
    // 'END OF INSERT USER LOG =============================================================

    await t.commit();
    return res.success();
}

const updateStatus = async(req) => {
    // Validator var main
    const result = help.validator(req.body, {
        'nilaistatus'   : 'required|numeric|max:12',
        'userid'        : 'required|numeric|min:0|max:255',
        'target'        : 'required',
    });
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);
    let target = req.body.target;
    let nilaiStatus = parseInt(req.body.nilaistatus);
    let idtransaksi = req.params.id;
    let userid = req.body.userid;
    
    // 'JIKA NUMERIC MAKA NILAISTATUS = PARAM NILAI STATUS YG DIINPUT
    // 'JIKA TIDAK MAKA NILAISTATUS = UNCLOSE
    if (Number.isInteger(nilaiStatus)) 
    {
        // 'JIKA NILAI STATUS < 0 ATAU NILAI STATUS > 12 MAKA NILAISTATUS TIDAK VALID
        if (nilaiStatus < 0 || nilaiStatus > 12)
        {
            // return res.fail("Invalid transaction status value.", 406, '', __line, __filename);
        }
    }
    else
    {
        if (nilaiStatus.toLowerCase() === "unclose")
            nilaiStatus = "unclose";
        else 
        {
            return res.fail("Invalid transaction status value.", 406, '', __line, __filename);
        }
    }

    // "*** Start Transaction ***"  
    let t = await knex.transaction();

    // 'PERSIAPAN INSERT USER LOG ==========================================================
    sumber = "cr"; tglTransaksi = "";
    mdlid = 0; mnid = 0; jnsaktivitas = 0; statusTransaksi = 0;
    // 'ambil moduleid, menuid dari m0_nomor dan tgl, notransaksi, status dari transaksi
    dtdetail = await t.raw("SELECT moduleid, menuid, 0 as statusTransaksi FROM f0_nomor WHERE kodetabel='" + sumber + "' UNION SELECT crtgl, crnotransaksi, crstatus FROM f2_cr WHERE crid='" + idtransaksi + "'");
    dtdetail = dtdetail[0]
    if (dtdetail.length > 1)
    {
        mdlid = dtdetail[0].moduleid;
        mnid = dtdetail[0].menuid; 
        tglTransaksi = dtdetail[1].moduleid;
        notransaksi = dtdetail[1].menuid;
        statusTransaksi = dtdetail[1].statusTransaksi;

        if(nilaiStatus == statusTransaksi)
        {
            return res.fail("Transaction 'notransaksi' status has been drafted.", 406, '', __line, __filename, t);
        }
    }
    else
    {
        return res.fail("#1. Transaction data not found.", 406, '', __line, __filename, t);
    }
    // 'END OF PERSIAPAN INSERT USER LOG ===================================================

    // 'JIKA UNCLOSE MAKA SET NILAI STATUS = STATUSSEBELUMNYA, JNSAKTIVITAS = 17. ELSE JNSAKTIVITAS = NILAISTATUS
    if (nilaiStatus === "unclose")
    {
        nilaiStatus = "crstatussebelumnya"; jnsaktivitas = 17;
        // 'CEK STATUS TRANSAKSI, JIKA <> 7 MAKA TIDAK BISA UNCLOSE
        if (statusTransaksi != 7)
        {
            return res.fail("Transaction has not closed, it can't be unclose.", 406, '', __line, __filename, t);
        }
    }
    else
        jnsaktivitas = nilaiStatus;

    // 'SET ISDELETE = TRUE JIKA STATUS TRANSAKSI = 2/3/4/7 DAN JNS AKTIVITAS <> 7(CLOSE) & 17(UNCLOSE)
    isDelete = ((statusTransaksi == 2 || statusTransaksi == 3 || statusTransaksi == 4 || statusTransaksi == 7) && jnsaktivitas != 7 && jnsaktivitas != 17); 

    // 'CEK PERIODE AKUNTANSI ==============================================================
    let rsCekPeriode = await M2_Accounting_PeriodeCheck(tglTransaksi, tglTransaksi);
    if(!rsCekPeriode.success) { return res.fail(rsCekPeriode.errmessage, 406, '', __line, __filename, t); }
    // 'END OF CEK PERIODE AKUNTANSI =======================================================

    // 'SIMPAN HISTORY ========================
    await insertHistory(t, 'f2_cr', 'crid', 'idcr', notransaksi, idtransaksi);
    // 'END OF SIMPAN HISTORY ==================

    if (isDelete)
    {
        // 'DELETE JURNAL
        sql = "DELETE FROM f2_transaction_journal WHERE tsumber = 'cr' AND tidtransaksi = '" + idtransaksi + "' AND tnotransaksi = '" + notransaksi + "'";
        await t.raw(sql);
    }

    // 'update status utama
    sql = "UPDATE f2_cr SET crstatus = " + nilaiStatus + ", crmodifikasiuser='" + userid + "', crmodifikasitgl = NOW(), crposting = 0, crpostingtgl = '1971-01-01 00:00:00', crjmlrevisi = crjmlrevisi + 1 WHERE crid = '" + idtransaksi + "'";
    await t.raw(sql);

    // 'INSERT USER LOG ====================================================================
    VALUES = userid + ", " + mdlid + ", " + mnid + ", " + jnsaktivitas + ", '" + notransaksi + "', NOW(), 0";
    sql = "INSERT INTO f0_userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) VALUES(" + VALUES + ")";
    await t.raw(sql);
    // 'END OF INSERT USER LOG =============================================================

    t.commit();
    return res.success();
}
    
const remove = async(req) =>
{
    const result = help.validator(req.query, {
        'idtransaksi'   : 'required|numeric|min:0',
        'userid'        : 'required|numeric|min:0|max:255',
        'target'        : 'required',
    });
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);
    
    idtransaksi = parseInt(req.query.idtransaksi)
    userid = req.userid;
    res.target = req.target;

    // '*** Start Transaction ***'
    let t = await knex.transaction();

    // 'PERSIAPAN INSERT USER LOG ==========================================================
    sumber = "cr"; notransaksi = ""; mdlid = 0; mnid = 0; jnsaktivitas = 0;
    // 'ambil moduleid dan menuid dari m0_nomor
    dtnomor = await knex.raw("SELECT moduleid, menuid FROM f0_nomor WHERE kodetabel='" + sumber + "' UNION SELECT crid, crnotransaksi FROM f2_cr WHERE crid='" + idtransaksi + "'");
    dtnomor = dtnomor[0]
    if (notEmpty(dtnomor))
    {
        mdlid = dtnomor[0].moduleid;
        mnid = dtnomor[0].menuid; 
        notransaksi = dtnomor[1].menuid;
    }
    else
    {
        return res.fail("#1. Transaction data not found.", 406, '', __line, __filename, t);
    }

    // 'hapus : jnsaktivitas = 12
    jnsaktivitas = 12;
    // 'END OF PERSIAPAN INSERT USER LOG ===================================================

    
    // 'PERSIAPAN UPDATE NOMOR BERIKUTNYA ==================================================
    // Dim cabang As String = "", lokasi As String = "", autonotransaksi As Integer = 0, tgl As String = ""
    sql = "  SELECT crcabang, crlokasi, crsumber, crautonotransaksi, crnotransaksi, crtgl, crstatus";
    sql += " FROM f2_cr";
    sql += " WHERE crid = '" + idtransaksi + "'";
    dtNomorNext = await knex.raw(sql);
    if (notEmpty(dtNomorNext))
    {
        notransaksi = dtNomorNext[0].crnotransaksi;
        status = dtNomorNext[0].crstatus;

        if(status == 2 || status == 3 || status == 4 || status == 7)
        {
            return res.fail("Can't delete No. : 'notransaksi' - it has been approved.", 406, '', __line, __filename, t);
        }
        cabang = dtNomorNext[0].crcabang;
        lokasi = dtNomorNext[0].crlokasi; 
        sumber = dtNomorNext[0].crsumber;
        autonotransaksi = parseInt(dtNomorNext[0].crautonotransaksi)
        tgl = dtNomorNext[0].crtgl;
    }
    else
    {
        return res.fail("#2. Transaction data not found.", 406, '', __line, __filename, t);
    }
    // 'END OF PERSIAPAN UPDATE NOMOR BERIKUTNYA ===========================================

    // 'DELETE JURNAL
    sql = "DELETE FROM f2_transaction_journal WHERE tsumber = 'cr' AND tidtransaksi = '" + idtransaksi + "' AND tnotransaksi = '" + notransaksi + "'";
    await t.raw(sql);

    // 'DELETE DETAIL
    sql = "DELETE FROM f2_cr_detail WHERE idcr = '" + idtransaksi + "'";
    await t.raw(sql);

    // 'DELETE UTAMA
    sql = "DELETE FROM f2_cr WHERE crid = '" + idtransaksi + "'";
    await t.raw(sql);

    // 'UPDATE NOMOR BERIKUTNYA ============================================================
    // 'JIKA AUTO NO. TRANSAKSI
    if (autonotransaksi == 1)
    {
        rsNomorNext = M0_DeleteNotransaksi(cabang, lokasi, sumber, tgl, notransaksi, sumber, 2);
        // 'Cek success M0_DeleteNotransaksi
        if (rsNomorNext.success == 1)
        {
            // 'tambah query update m0_nomor_next
            await t.raw(rsNomorNext.sql);
        }
        else
        {
            return res.fail(rsNomorNext.errmessage, 406, '', __line, __filename, t);
        }
    }
    // 'END OF UPDATE NOMOR BERIKUTNYA =====================================================

    // 'INSERT USER LOG ====================================================================
    VALUES = userid + ", " + mdlid + ", " + mnid + ", " + jnsaktivitas + ", '" + notransaksi + "', NOW(), 0";
    sql = "INSERT INTO f0_userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) VALUES("+ VALUES +")";
    await t.raw(sql);
    // 'END OF INSERT USER LOG =============================================================

    t.commit();
    
    return res.succes();
}

const getDataById = async(req) =>
{
    const result = help.validator(req.body, {
        'idtransaksi'   : 'required|numeric|min:0',
        'target'        : 'required',
    });
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    idtransaksi = parseInt(req.body.idtransaksi)
    target = req.body.target;
    filter = "WHERE crid = idtransaksi";
    
    sql = `
        SELECT 
            cr.* ,br.bnama AS crcabangnama,lc.lnama AS crlokasinama,c.kkode AS crkontakkode,
            c.knama AS crkontaknama,coa.cnama AS crnoreknama,st1.nama AS crstatusnama,st2.nama AS crstatussebelumnyanama,
            u1.unama AS crinputusernama,u2.unama AS crmodifikasiusernama,crd.*,
            coa1.cnama AS noreknama,cc.ccnama AS costcenternama,d.dnama AS divisinama,sd.sdnama AS subdivisinama,
            p.pnama AS proyeknama 
        from f2_cr cr 
        join f2_cr_detail crd on cr.crid = crd.idcr 
        left join f1_branch br on cr.crcabang = br.bkode 
        left join f1_location lc on cr.crlokasi = lc.lkode 
        left join f1_contact c on cr.crkontak = c.kid 
        left join f1_coa coa on cr.crnorek = coa.cnomor 
        left join f0_status st1 on cr.crstatus = st1.kode 
        left join f0_status st2 on cr.crstatussebelumnya = st2.kode 
        left join f0_user u1 on cr.crinputuser = u1.userid 
        left join f0_user u2 on cr.crmodifikasiuser = u2.userid 
        left join f1_coa coa1 on crd.norek = coa1.cnomor 
        left join f1_cost_center cc on crd.costcenter = cc.cckode 
        left join f1_division d on crd.divisi = d.dkode 
        left join f1_subdivision sd on crd.subdivisi = sd.sdkode 
        left join f1_project p on crd.proyek = p.pkode `;
    sql += filter;

    dt = await knex.raw(sql);

    get_val = '';
    utama = {}; arrDetail = [];
    for (const i in dt) {
    // foreach(dt as i : arr)
    // {
        arr = dt[i]
        detail = {}

        for (const col in arr) {
            val = arr[col]
        // foreach(arr as col : val)
        // {
            // SET DATA UTAMA
            if(i == 0)
                utama[col] = val;

            // SET DATA DETAIL
            detail[col] = val;
        }

        arrDetail.push(detail);
    }

    res.data = [utama, arrDetail];

    t.commit();
    return res.succes();
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
        app.put('/f2/cr/updateStatus/:id', async(req, result) => {
            let respond
            try {
                respond = await updateStatus(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        app.delete('/f2/cr/delete', async(req, result) => {
            let respond
            try {
                respond = await remove(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
    }    
};