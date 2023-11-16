exports.view = (req, res) => {
    res.render('home', {isHomePage: true})
}

exports.register = (req, res) => {
    res.render('register')
}

exports.response = (req, res) => {
    //Get information
    const email = req.body.inputEmail;
    const name = req.body.inputName;
    const phone = req.body.inputPhoneNumber;
    const agreement = req.body.flexRadioDefault === 'agree' ? 'Cảm ơn bạn đã đăng ký tham gia' : 'Bạn không đồng ý tham gia';
    res.render('response', {email, name, phone, agreement});
}