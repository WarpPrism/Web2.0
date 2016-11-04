$(document).ready(function() {
	sortType = '';
	$('.sort-table').on('click', 'th', 'data', function(e) {
		// reset style
		$(e.target).parent().find('th').each(function(index, item) {
			$(item).removeClass('ascend');
			$(item).removeClass('descend');
		});
		startSort(e.target);
	});
});

function startSort(th) {
	// select sort type
	if (sortType == 'descend') {
		sortType = 'ascend';
		$(th).addClass('ascend');
	} else if (sortType == 'ascend') {
		sortType = 'descend';
		$(th).addClass('descend');
	} else {
		sortType = 'descend';
		$(th).addClass('descend');
	}
	// calculate cloumnId
	var columnId = 0;
	$(th).parent().find('th').each(function(index, item) {
		if (item == th) {
			columnId = index;
		}
	});
	// QuickSort
	var table = $(th).parents('.sort-table');
	var trs = $(table).find('tbody tr').toArray();
	trs = quickSort(trs, sortType, columnId);

	// modify DOM
	$(table).find('tbody tr').remove();
	trs.forEach(function(item, idnex) {
		$(table).find('tbody').append(item);
	});
}

function quickSort(trArr, type, columnId) {
	if (trArr.length <= 1) {
		return trArr;
	}
	var left = [], right = [];
	var midddle = Math.floor(trArr.length / 2);
	var pivotTr = trArr.splice(midddle, 1)[0];
	var pivot = $(pivotTr).find('td').toArray()[columnId].innerHTML.toString();
	for (var i = 0; i < trArr.length; i++) {
		var item = $(trArr[i]).find('td').toArray()[columnId].innerHTML.toString();
		if (type == 'descend') {
			if (item < pivot) {
				right.push(trArr[i]);
			} else {
				left.push(trArr[i]);
			}
		} else if (type == 'ascend') {
			if (item < pivot) {
				left.push(trArr[i]);
			} else {
				right.push(trArr[i]);
			}
		}
	}
	return quickSort(left, type, columnId).concat([pivotTr], quickSort(right, type, columnId));
}
