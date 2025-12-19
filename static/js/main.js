$(document).ready(function() {
    $.ajaxSetup({
        beforeSend: function() {
            showLoading();
        },
        complete: function() {
            hideLoading();
        }
    });
    
    initAnimations();
    initTooltips();
    initConfirmDialogs();
});

function showLoading() {
    $('#loading-overlay').removeClass('d-none');
}

function hideLoading() {
    $('#loading-overlay').addClass('d-none');
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card, .stat-card, .bubble-stat').forEach(el => {
        observer.observe(el);
    });
}

function initTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function initConfirmDialogs() {
    $(document).on('click', '.confirm-delete', function(e) {
        e.preventDefault();
        const href = $(this).attr('href') || $(this).data('href');
        const itemName = $(this).data('name') || 'item ini';
        
        Swal.fire({
            title: 'Padam ' + itemName + '?',
            text: 'Tindakan ini tidak boleh dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, padam!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = href;
            }
        });
    });
    
    $(document).on('click', '.confirm-action', function(e) {
        e.preventDefault();
        const href = $(this).attr('href') || $(this).data('href');
        const title = $(this).data('title') || 'Sahkan tindakan?';
        const text = $(this).data('text') || '';
        
        Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#343a40',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = href;
            }
        });
    });
}

function searchMurid(query) {
    if (query.length < 2) {
        $('#search-results').removeClass('active').empty();
        return;
    }
    
    $.get('/api/search-murid', { q: query }, function(data) {
        const resultsDiv = $('#search-results');
        resultsDiv.empty();
        
        if (data.length === 0) {
            resultsDiv.append('<div class="search-result-item text-muted">Tiada murid dijumpai. Sila isi maklumat manual.</div>');
            $('#manual-form').slideDown();
        } else {
            data.forEach(function(murid) {
                resultsDiv.append(`
                    <div class="search-result-item" onclick="selectMurid(${murid.id}, '${murid.nama_penuh}', '${murid.ic}', '${murid.kelas}', '${murid.jantina}')">
                        <strong>${murid.nama_penuh}</strong><br>
                        <small class="text-muted">${murid.ic} | ${murid.kelas} | ${murid.jantina}</small>
                    </div>
                `);
            });
            $('#manual-form').slideUp();
        }
        
        resultsDiv.addClass('active');
    });
}

function selectMurid(id, nama, ic, kelas, jantina) {
    $('#murid_id').val(id);
    $('#search-nama').val(nama);
    $('#display-nama').text(nama);
    $('#display-ic').text(ic);
    $('#display-kelas').text(kelas);
    $('#display-jantina').text(jantina);
    $('#selected-murid').slideDown();
    $('#search-results').removeClass('active');
    $('#manual-form').slideUp();
}

function clearSelection() {
    $('#murid_id').val('');
    $('#search-nama').val('');
    $('#selected-murid').slideUp();
    $('#manual-form').slideUp();
}

function toggleSelectAll(source) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
    updateBulkActions();
}

function updateBulkActions() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length;
    const bulkActions = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    
    if (checked > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = checked;
    } else {
        bulkActions.style.display = 'none';
    }
}

function bulkDelete() {
    const selected = getSelectedIds();
    if (selected.length === 0) return;
    
    Swal.fire({
        title: `Padam ${selected.length} item?`,
        text: 'Tindakan ini tidak boleh dibatalkan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, padam semua!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            $.post('/api/bulk-delete', { ids: selected.join(',') }, function(response) {
                if (response.success) {
                    location.reload();
                }
            });
        }
    });
}

function getSelectedIds() {
    const ids = [];
    document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
        ids.push(cb.value);
    });
    return ids;
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    animateNumber(el, target);
});

function toggleLoginSidebar() {
    document.querySelector('.login-sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

function closeSidebar() {
    document.querySelector('.login-sidebar').classList.remove('active');
    document.querySelector('.sidebar-overlay').classList.remove('active');
}

function categorizeReason(reason) {
    const cuacaKeywords = ['hujan', 'panas', 'ribut', 'banjir', 'kilat', 'petir', 'sejuk', 'lebat'];
    const keluargaKeywords = ['sakit', 'hospital', 'kecemasan', 'emergency', 'ibu', 'bapa', 'adik', 'kakak', 'nenek', 'datuk', 'hantar', 'penghantar'];
    const transportKeywords = ['jalan', 'sesak', 'jam', 'traffic', 'kereta', 'motor', 'motosikal', 'bas', 'rosak', 'pancit', 'tayar', 'minyak', 'kemalangan', 'accident'];
    
    const lowerReason = reason.toLowerCase();
    
    if (cuacaKeywords.some(k => lowerReason.includes(k))) return 'cuaca';
    if (keluargaKeywords.some(k => lowerReason.includes(k))) return 'keluarga';
    if (transportKeywords.some(k => lowerReason.includes(k))) return 'transport';
    return 'lain';
}

function formatDate(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('ms-MY', options);
}

function formatTime(timeStr) {
    return timeStr.substring(0, 5);
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Berjaya!',
        text: message,
        timer: 2000,
        showConfirmButton: false
    });
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Ralat!',
        text: message
    });
}

function printPreview(url) {
    Swal.fire({
        title: 'Pratonton Surat',
        html: '<iframe src="' + url + '" style="width:100%;height:400px;border:none;"></iframe>',
        width: '80%',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-download"></i> Muat Turun',
        cancelButtonText: 'Tutup'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = url + '?download=1';
        }
    });
}
