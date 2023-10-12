function isFullNameValid(fullname) {
    if (fullname.length === 0) {
        return false;
    }
    return /^[A-Z]/.test(fullname[0]);
}
function isUserNameValid(username){
    if (username.length == 0){
        return false;
    }
    const nameRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;
    return nameRegex.test(username); 
}
function isPhoneNumberValid(phoneNumber){
    if (phoneNumber.length == 0){
        return false;
    }
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phoneNumber);
}
function isEmailValid(email){
    if (email.length == 0){
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
function isValidDateOfBirth(dateOfBirth) {
    if (dateOfBirth.length == 0) {
        return false;
    }

    // Get birth date
    const birthDate = new Date(dateOfBirth);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1; // Months are zero-indexed
    const birthDay = birthDate.getDate();

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    // Calculate age
    let age = currentYear - birthYear;

    // Adjust age if birthday hasn't occurred yet this year
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }

    // Now you can use the 'age' variable for validation or other purposes
    return age >= 15 && age <= 55;
}


$(document).ready(function(){
    $('.submission-btn').click(function(e){
        e.preventDefault();
        
        let isValid = true;

        if (!isFullNameValid($('#fullname').val())){
            $('#fullname').addClass('invalid');
            $('.efn').text('*Họ và tên không hợp lệ');
            $('.efn').css('display', 'block');
            isValid = false;
        }
        else{
            $('#fullname').removeClass('invalid');
            $('.efn').css('display', 'none');
        }

        if (!isUserNameValid($('#username').val())){
            $('#username').addClass('invalid');
            $('.eun').text('*Username không hợp lệ');
            $('.eun').css('display', 'block');
            isValid = false;
        }
        else{
            $('#username').removeClass('invalid');
            $('.eun').css('display', 'none');
        }

        if (!isEmailValid($('#email').val())){
            $('#email').addClass('invalid');
            $('.eemail').text('*Email không hợp lệ');
            $('.eemail').css('display', 'block');
            isValid = false;
        }
        else{
            $('#email').removeClass('invalid');
            $('.eemail').css('display', 'none');
        }

        if (!isPhoneNumberValid($('#phoneNumber').val())){
            $('#phoneNumber').addClass('invalid');
            $('.etel').text('*Số điện thoại không hợp lệ');
            $('.etel').css('display', 'block');
            isValid = false;
        }
        else{
            $('#phoneNumber').removeClass('invalid');
            $('.etel').css('display', 'none');
        }

        if (!isValidDateOfBirth($('#dateOfBirth').val())){
            $('#dateOfBirth').addClass('invalid');
            $('.edate').text('*Ngày tháng năm sinh không hợp lệ');
            $('.edate').css('display', 'block');
            isValid = false;
        }
        else {
            $('#dateOfBirth').removeClass('invalid');
            $('.edate').css('display', 'none');
        }

        // If all fields are valid, allow form submission
        if (isValid) {
            $('form').submit();
        }
    });
});
