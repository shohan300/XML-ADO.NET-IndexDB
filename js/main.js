$(document).ready(function () {
    debugger;

    var request, db;
    $('#prImage').on('change', bindImage);

    // Code for declare database and check browser capibility
    if (!window.indexedDB) {
        console.log("Your Browser does not support IndexedDB");
    }

    else {
        request = window.indexedDB.open("myTestDB1", 25);

        request.onerror = function (event) {
            console.log("Error opening DB", event);
        }
        request.onupgradeneeded = function (event) {
            console.log("Upgrading");
            db = event.target.result;
            var objectStore = db.createObjectStore("students", {keyPath: "rollNo", autoIncrement: true});

        }
        request.onsuccess = function (event) {
            console.log("Success opening DB");
            db = event.target.result;
            showAllDataMethod();
        }
    }


    //showAllData-------------------------------------------------------------------------------------

    function showAllDataMethod() {
        
        var request = db.transaction(["students"], "readonly").objectStore("students").getAll();
        request.onsuccess = function (event) {
            
            var image = new Image();
            var record = event.target.result;
            console.log('get success', record);
            
            image.src = 'data:image/jpeg;base64,' + btoa(record.File);
            
            var obj = request.result
            
            var table = '';
            $.each(obj, function () {
                table += '<tr><td>' + this['rollNo'] + '</td> <td>' + this['FirstName'] + '</td>  <td>' + this['LastName'] + '</td>  <td>' + this['City'] + '</td>  <td>' + this['Mobile'] + '</td> <td> <img width="80" height="80" src="' + this['File'] + '"/> </td></tr>';
            });
            $("#datalist").html(table);


            var str = "<option value=''> </option>";
            $.each(obj, function () {
                 str += '<option value=' + this['rollNo'] + '>' + this['rollNo'] + '</option>';
            });
            $("#ddlid").html(str);
        };
    }


    // insert Function -------------------------------------------------------------------------------------

    $('#addBtn').on('click', function (e) {
        e.preventDefault();
        var img = new Image();

        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var city = $('#city').val();

        var mobile = $('#mobile').val();

        img.src = $('#holdImg').attr('src');

        var image = img.src;

        var transaction = db.transaction(["students"], "readwrite");

        var objectStore = transaction.objectStore("students");


        objectStore.add({ FirstName: firstName, LastName: lastName, City: city, Mobile: mobile, File: image });

        transaction.oncomplete = function (event) {
            console.log("Success :)");
            $('#result').html("Add: Successfully");
        };
        transaction.onerror = function (event) {
            console.log("Error :)");
            $('#result').html("Add: Error occurs in inserting");
        };
        showAllDataMethod();
        ClearTextBox();
    });



//  Update Function -----------------------------------------------------------------------------
    $('#updateBtn').click(function () {

        var rollNo = parseInt($('#ddlid').val());
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var city = $('#city').val();
        var mobile = $('#mobile').val();
        var img = new Image();
        img.src = $('#holdImg').attr('src');
        var image = img.src;
        var transaction = db.transaction(["students"], "readwrite");
        var objectStore = transaction.objectStore("students");
        var request = objectStore.get(rollNo);
        request.onsuccess = function (event) {

            request.result.FirstName = firstName;
            request.result.LastName = lastName;
            request.result.City = city;
            request.result.Mobile = mobile;
            request.result.File = image;
            objectStore.put(request.result);
            alert('Recored Updated Successfully !!!');
            showAllDataMethod();
            ClearTextBox();
        };
    });


    //  Delete Function -----------------------------------------------------------------------------
    $('#deleteBtn').click(function () {
        var id = parseInt($('#ddlid').val());
        db.transaction(["students"], "readwrite").objectStore("students").delete(id);
        alert(' Recored No. ' + id + ' Deleted Successfully !!!');
        showAllDataMethod();
        ClearTextBox();
    });

    

    // image Add -------------------------------------------------------------------

	function bindImage(e) {
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function (evt) {
			var result = evt.target.result;
			$('#holdImg').removeAttr('src');
			$('#holdImg').attr('src', result);
		}
	}



 // All Text Clear Function -------------------------------------------------------------------------------

    function ClearTextBox() {
        $('#firstName').val('');
        $('#lastName').val('');
        $('#city').val('');
        $('#mobile').val('');
        $('#ddlid').val('');
        $('#holdImg').attr('src', 'images/placeholder.png');
        $('#prImage').val('');
    }




// Code for Read Data from Indexed on for edit(Single Record) ---- Importent
    $('#showinfo').click(function () {
        debugger;
        var id = parseInt($('#ddlid').val());
        var request = db.transaction(["students"], "readonly").objectStore("students").get(id);
        request.onsuccess = function (event) {
            var r = request.result;
            console.log(r);
            if (r != null) {
                $('#firstName').val(r.FirstName);
                $('#lastName').val(r.LastName);
                $('#city').val(r.City);
                $('#mobile').val(r.Mobile);
                $('#holdImg').attr('src', r.File);
            } else {
                ClearTextBox();
                alert('Record Does not exist');
            }

        };
    });


    // Dropdown ---------------------------------------------------------------------------
        document.getElementById('dropZone').addEventListener('dragover',  (e) =>{
            e.preventDefault();
            });
                
            document.getElementById('dropZone').addEventListener('drop',  (e) =>{
            e.preventDefault();
            var files = e.dataTransfer.files;
                            
                if (files && files[0]) {
                    var reader = new FileReader();
                
                    reader.onload = function (e) {
                        imageName=e.target.result;
                        $('#holdImg').attr('src', e.target.result);
                    };
                     reader.readAsDataURL(files[0]);
                }
            });


});
