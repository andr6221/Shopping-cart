// Denne fil kører på front-end og ikke vores backend server node js server

// vi definerer vores public key, der skal bruges for at Stripe kan genkende vores betaling
// Se stripe dokumentation for mere info: https://stripe.com/docs/js/including


Stripe.setPublishableKey('pk_test_f3VUjBajSixQmtmPKdxoKPzX003Rp7GgkO');

// Vi henter vores form ved hjælp af Jquery til at vælge check-out form. Dette er ID vi har lavet i vores checkout.hbs view
var $form = $('#checkout-form');

// Vi bruger vores form til at lave en Jquery submit-listener, der sørger for at funktionen bliver eksekveret hver gang vi submitter vores form
$form.submit(function (event) {
    $('#charge-error').addClass('hidden');
    // Vi bruger vores form til at finde betalingsknappen. Vi sætter herefter disabled propertyen til true, hvilket gør at brugeren ikke submitte formen flere gange med
    $form.find('button').prop('disabled', true);
    // Vi laver et token, hvor vi henter alle vores ID's fra vores HBS side
    Stripe.card.createToken({
        number: $('#card-number').val(),
        //funktionen har vores data som første argument
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    // Andet argument er vores responsehandler, der bliver eksekveret efter at data'en er blevet valideret
    }, stripeResponseHandler);
    // Vi sørger for at form-submition stopper og dermed ikke sender en forespørgsel til vores server endnu, da data'en ikke er blevet valideret endnu
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

    }
}