setTimeout(() => {
    /************For Add form *************/
    $('#add').click(function () {
        $('#select1 option:selected').each(function (el) {
            $(this).appendTo('#select2');
        });
        var optionCount = $('#select2 option').length;
        if(optionCount >0){
            $('.checkbutton').removeClass('btn-disabled')
        }else{
            $('.checkbutton').addClass('btn-disabled')
        }
    });

    $('#remove').click(function () {
        $('#select2 option:selected').each(function (el) {
            $(this).appendTo('#select1');
        });
        var optionCount = $('#select2 option').length;
        if(optionCount >0){
            $('.checkbutton').removeClass('btn-disabled')
        }else{
            $('.checkbutton').addClass('btn-disabled')
        }
    });

    /**********For search form ************/
    $('#added1').click(function () {
        $('#select3 option:selected').each(function (el) {
            $(this).appendTo('#select4');
        });
    });

    $('#removed1').click(function () {
        $('#select4 option:selected').each(function (el) {
            $(this).appendTo('#select3');
        });
    });
}, 500);