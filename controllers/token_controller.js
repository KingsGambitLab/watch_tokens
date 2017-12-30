const etherscan = require('etherscan-api').init('Q2Z88KZJ2N9NR57UDKVMBM3Q228CJ3CXF6')
    , Web3  = require('web3')
;

const web3 = new Web3();
const rootPrefix  = ".."
    , Token       = require( rootPrefix + "/models/Token")
;





/**
 * GET /token/new
 * New Token Form
 */

exports.newTokenForm = (req, res, next) => { 
    res.render('token/newTokenForm', {
        title: 'Add New Token'
    });
};


/**
 * POST /token/create
 * Create new Token.
 */
exports.create = (req, res, next) => { 
    req.assert('token_name', 'Token Name cannot be blank.').notEmpty();
    req.assert('token_address', 'Token address cannot be blank.').notEmpty();
    var errors = req.validationErrors();

    var tokenAddress    = null
        , tokenName     = null
    ;

    if ( req.body.token_address && !errors ) {
        tokenAddress = req.body.token_address;

        if ( web3.utils.isHex(tokenAddress) && !web3.utils.isHexStrict( tokenAddress ) ) {
            tokenAddress = "0x" + tokenAddress;
        }

        if ( web3.utils.isAddress( tokenAddress ) ) {
            tokenAddress = web3.utils.toChecksumAddress( tokenAddress );
        } else {
            errors = [{
                param: 'token_address',
                msg: 'Invalid Token Address',
                value: tokenAddress
            }];            
            console.log( "tokenAddress ::", tokenAddress);
        }
    }

    if ( errors ) {
        console.log( "errors" );
        console.dir( errors );
        req.flash('errors', errors);
        return res.redirect('/token/new/');
    }

    tokenName    = req.body.token_name;

    //Promise Chain Begins!
    Token.findOne({ address: tokenAddress})
    .catch( (err) => { 
        console.log( "findOne catch" );
        console.dir( err );
        errors = [{
            param: 'token_address',
            msg: 'Failed to validate token address. ' + err.message,
            value: tokenAddress
        }];
        throw "tokenAddress validation failed"; /* Goes to final catch block */
    })
    .then( token => {
        if ( token ) {
            console.log("token");
            console.log( token );
            errors = [{
                param: 'token_address',
                msg: 'Token with this address already exists.',
                value: tokenAddress
            }];
            throw "Token with this address already exists."; /* Goes to final catch block */
        }
    })
    .then( _ => { /* Fetch ABI */
        console.log("tokenAddress :: ", tokenAddress);
        return etherscan.contract.getabi( tokenAddress )
            .catch( (err) => { /* Fetching ABI failed. */
                console.log( "catch" );
                console.dir( err );
                errors = [{
                    param: 'token_address',
                    msg: 'Etherscan failed to return ABI.',
                    value: tokenAddress
                }];
                throw "Failed to get token abi."; /* Goes to final catch block */
            })
    })
    .then( (response) => { /* ABI Success Response */
        const abi = response["result"];
        const newToken = new Token({
            address : tokenAddress
            ,abi    : abi
        })

        return newToken.save()
            .catch( (reason) => {
                console.log("token_controller :: create :: newToken.save catch :: reason :: ");
                console.log(reason);
                errors = [{
                    param: 'token_address',
                    msg: 'Failed to save token',
                    value: tokenAddress
                }];
                throw 'Failed to save token'; /* Goes to final catch block */
            })
        ;
    })
    .then( (newToken) => { /* New Token has been created. */
        console.log("Got new token!");
        console.log( newToken );
        req.flash('success', { msg: "New Token Created successfully"});
        res.redirect('/token/new/');
    })
    .catch( reason => { /* This catches all exceptions */
        console.log("token_controller :: create catch :: reason :: ");
        console.error( reason );
        if ( !errors ) {
            errors = [{
                msg: 'Something went wrong.'
            }]
        }
        req.flash('errors', errors);
        res.locals.errors = errors;
        res.redirect('/token/new/');
    });
};


