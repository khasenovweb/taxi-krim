 $(document).ready(function(){
 	$('input[data-input="date"]').datepicker({
        timepicker: true,
        dateFormat: 'd MM yyyy'
    });

    $('input[data-input="date"]').on('change', function(){
    	console.log($(this).val());
    });

    $('select.dropdown').dropdown({
    	onChange: function(value, text, $selectedItem) {
    	      console.log(value);
    	    }
    });
 });