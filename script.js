const ps = new PerfectScrollbar('#cells', {
    wheelSpeed: 2,
    wheelPropagation: true,
});

function findRowCol(ele){
    let idarray = $(ele).attr("id").split("-");
    let rowId = parseInt(idarray[1]);
    let colId = parseInt(idarray[3]);

    return [rowId,colId];
}

for (let i = 1; i <= 100; i++) {

    let str = '';
    let n = i;

    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = 'Z' + str;
            n = Math.floor((n / 26) - 1);
        }
        else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor((n / 26));
        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`);
    $("#rows").append(`<div class="row-name">${i}</div>`);

}

for (let i = 1; i <= 100; i++) {
    let row = $('<div class="cell-row"></div>');
    for (j = 1; j <= 100; j++) {
        row.append(`<div id="r-${i}-c-${j}" class="input-cell" contenteditable="false"></div>`);
    }
    $("#cells").append(row);
}

$("#cells").scroll(function () {
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop)
})
$(".input-cell").dblclick(function () {
    $(this).attr("contenteditable", "true");
    $(this).focus();
})
$(".input-cell").blur(function () {
    $(this).attr("contenteditable", "false");
})
function getTopBottomLeftRight(rowId, colId){
    let topcell = $(`#r-${rowId - 1}-c-${colId}`);
    let rightcell = $(`#r-${rowId}-c-${colId + 1}`);
    let bottomcell = $(`#r-${rowId + 1}-c-${colId}`);
    let leftcell = $(`#r-${rowId}-c-${colId - 1}`);

    return [topcell,bottomcell,leftcell,rightcell];
}
$(".input-cell").click(function (e) {
   
    let [rowId, colId] = findRowCol(this);
    let [topcell,bottomcell,leftcell,rightcell] =  getTopBottomLeftRight(rowId, colId);
    if ($(this).hasClass("selected")) {
        unselectCell(this, e, topcell, bottomcell, leftcell, rightcell);
    }
    else {
        selectCell(this, e, topcell, bottomcell, leftcell, rightcell);
    }

})
function unselectCell(ele, e, topcell, bottomcell, leftcell, rightcell) {

    if (e.ctrlKey && $(ele).attr("contenteditable") == "false") {

        if ($(ele).hasClass("top-selected")) {
            topcell.removeClass("bottom-selected");
        }
        if ($(ele).hasClass("bottom-selected")) {
            bottomcell.removeClass("top-selected");
        }
        if ($(ele).hasClass("left-selected")) {
            leftcell.removeClass("right-selected");
        }
        if ($(ele).hasClass("right-selected")) {
            rightcell.removeClass("left-selected");
        }
    }
    
    $(ele).removeClass("selected top-selected bottom-selected right-selected left-selected");
    

}
function selectCell(ele, e, topcell, bottomcell, leftcell, rightcell, mouseSelection) {
    
    if (e.ctrlKey || mouseSelection) {

        // Top selected or not
        let topSelected;
        if (topcell) {
            topSelected = topcell.hasClass("selected");
        }

        // Right selected or not 
        let rightSelected;
        if (rightcell) {
            rightSelected = rightcell.hasClass("selected");
        }

        // Bottom selected or not 
        let bottomSelected;
        if (bottomcell) {
            bottomSelected = bottomcell.hasClass("selected");
        }

        // Left selected or not 
        let leftSelected;
        if (leftcell) {
            leftSelected = leftcell.hasClass("selected");
        }

        if (topSelected) {
            topcell.addClass("bottom-selected");
            $(ele).addClass("top-selected");
        }
        if (leftSelected) {
            leftcell.addClass("right-selected");
            $(ele).addClass("left-selected");
        }
        if (bottomSelected) {
            bottomcell.addClass("top-selected");
            $(ele).addClass("bottom-selected");

        }
        if (rightSelected) {
            rightcell.addClass("left-selected");
            $(ele).addClass("right-selected");

        }
    }
    else {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected right-selected left-selected");
    }
    $(ele).addClass("selected");
}
let mousemoved = false ;
let startCellStored = false ;
let startCell, endCell ;
$(".input-cell").mousemove(function(event){
    if(event.buttons == 1 && !startCellStored){
        mousemoved = true;
        startCellStored = true ;
        let [rowId, colId] = findRowCol(event.target);
        startCell = {"row"};
    }
    else if(mousemoved && event.buttons == 0){
        mousemoved = false;
        startCellStored = false;
        let [rowId, colId] = findRowCol(event.target);
        endCell = $(`r-${rowId}-c-${colId}`);
    }
})
 function selectCellsInRange(start,end){
     for(let i=start.rowId; i<=end.rowId;i++){
         for(let j=start.colId;j<=end.colId;j++){
             selectCell($(`r-${i}-c-${j}`)[0], {}, $(`r-${i-1}-c-${j}`), $(`r-${i+1}-c-${j}`), $(`r-${i}-c-${j-1}`), $(`r-${i}-c-${j+1}`), true );
         }
     }
 }