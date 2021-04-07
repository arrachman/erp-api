
const tableName = 'f0_user';
const primaryKey = 'userid';
const jwt = require('jsonwebtoken');

const login = async(req) => {
    const param = JSON.parse(req.query.param);
    res.target = param.target; 
    let refreshToken = Math.floor(Date.now() / 1000) +parseInt(process.env.REFRESH_AUTH)
    let resetToken = Math.floor(Date.now() / 1000) + parseInt(process.env.RESET_AUTH) 
    
    const result = help.validator(req.body, {
        "user"    : "required",
        "pass"  : "required"
    });

    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    let t = await knex.transaction();
    dt = await t.raw("SELECT * FROM f0_user WHERE ukode ='" + req.body.user + "' AND upassword = '" + req.body.pass + "'");
    arrUser = []; 
    // arrSetting = [];

    if (notEmpty(dt[0])) 
    {
        vuserid = dt[0][0].userid; 
        for (const i in dt[0]) {
                arr = dt[0][i]
                detail = {}
                for (const col in arr) {
                    val = arr[col]
                    // SET DATA DETAIL USER
                    detail[col] = val;
                }
        
                arrUser.push(detail);
            }

            // dt = await t.raw("SELECT * FROM f0_setting "); 
            // for (const
            //     arr = dt[0][i]
            //     detail = {}
            //     for (const col in arr) {
            //         val = arr[col]
            //         // SET DATA DETAIL SETTING
            //         detail[col] = val;
            //     }
        
            //     arrSetting.push(detail);
            // }
    }
    else
    {
        return res.fail("Invalid username or password", 406, '', __line, __filename, t);
    }

    const checkLogin = vuserid != 0
    var token = "";
    if (checkLogin) {
        token = jwt.sign({ id: vuserid, role: 'admin', iat:  resetToken }, process.env.SECRET, { expiresIn: refreshToken});
        if (token) {
            const response = {
                "status": "Logged in",
                "token": token,
                refreshToken, resetToken,
            }
            tokenList[token] = response
            res.data = {
                        message: "Success Sign In",
                        token: token,
                        arrUser
                        // ,arrSetting
                    };
        }else{
            return res.fail('Failed create token', 401);
        }
    } else {
        return res.fail('Failed Sign In', 401);
    }
    // if(help.attempt({'ukode':req.body.username, 'password':req.body.password}))
    //     return res.fail('Your credential is wrong', 401);

    // result = help.UpdateData(tableName, 'ukode', req.body.username, {'utoken': help.bcrypt(help.dateNow())});

    // if(!result.success)
    //     return res.fail('Update Failed', null, result.messageDev);

    // let db = new help.ModelsDB('tableName');
    // db.select = 'utoken';
    // res.data = db.getDataById('ukode', req.body.username);

    // 'INSERT USER LOGIN ====================================================================
    sql = "DELETE FROM f0_userlogin WHERE uluser = '" + vuserid + "';";
    await t.raw(sql);
    
    VALUES = "'" + token + "', '" + vuserid + "', '" + "ip client" + "', '" + 1 + "', NOW()";
    sql = "INSERT INTO f0_userlogin (ultoken, uluser, ulcomputerip, ulaktif, ultgl) VALUES("+ VALUES +");";
    await t.raw(sql);
    // 'END OF INSERT USER LOGIN =============================================================
    
    t.commit();

    return res.success()
}

module.exports = {
    app: app => {
    // register: async(req) => {
    //     const valid = {
    //         'ukode'             : 'required|max:25',
    //         'unama'             : 'required|max:100',
    //         'uaktif'            : 'required|numeric',
    //         'ulevel'            : 'required|numeric',
    //         'ubahasa'           : 'required|max:25',
    //         'uaktivitasproduksi': 'required|numeric'};
    //     let result = help.validator(req.body, valid);
    //     if(!result.success)
    //         return res.fail(result.message, null, result.messageDev);
        
    //     const param = JSON.parse(req.query.param);
    //     res.target = param.target; 

    //     let checkById = await db.checkDataById(tableName, primaryKey, req.body[primaryKey]);
    //     if(checkById)
    //         return res.fail("Data already exiss '" + req.body[primaryKey] + "'");
    
    //     $dataPost = {};
    //     const arrdataPost = help.strToArray('ukode, upassword, unama, uaktif, ulevel, ubahasa, uaktivitasproduksi, utoken');
    //     for(const key in arrdataPost)
    //     {
    //         let column = arrdataPost[$i];
    //         let value  = req.body[$column];
            
    //         value = column == 'upassword' ? help.bcrypt(value) : value;
    //         value = column == 'utoken' ? help.bcrypt(help.dateNow()) : value;

    //         $value = isEmpty($value) ? '' : value;
            
    //         dataPost[column] = value;
    //     }

    //     result = help.insertDataResIndex(tableName, dataPost);
    //     res.data = result.success ? help.checkDataById(tableName, primaryKey, result['id']) : '';

    //     return res.success();
    // },

        app.post('/f0/auth/login', async(req, result) => {
            let respond
            try {
                respond = await login(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });

    // logout: async(req) => {
    //     const param = JSON.parse(req.query.param);
    //     res.target = param.target; 

    //     let authorization = req.headers['authorization'][0];
    //     authorization = authorization.split('Bearer').join('');
    //     res.data = help.UpdateData(tableName, 'utoken', authorization, {'utoken' : ''});

    //     return res.success();
    // }
    
    }
};