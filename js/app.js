lucide.createIcons();

document.getElementById('year').textContent = new Date().getFullYear();

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const resultTitle = document.getElementById('resultTitle');

function getIconForType(type) {
    const t = type.toLowerCase();
    if (t.includes('manual') || t.includes('pdf') || t.includes('brochure')) return 'book-open';
    if (t.includes('driver')) return 'settings';
    if (t.includes('utility') || t.includes('software')) return 'cpu';
    if (t.includes('firmware')) return 'hard-drive';
    return 'file';
}

function renderResults(data, query = "") {
    resultsGrid.innerHTML = '';
    
    if (data.length === 0) {
        resultsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        resultCount.textContent = '0 items';
        resultTitle.textContent = query ? `Results for "${query}"` : 'Available Downloads';
        return;
    }

    resultsGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');
    
    resultCount.textContent = `${data.length} item${data.length > 1 ? 's' : ''}`;
    resultTitle.textContent = query ? `Results for "${query}"` : 'All Available Downloads';

    data.forEach((item, index) => {
        const delay = index * 50;
        const iconName = getIconForType(item.type);

        const tile = document.createElement('a');
        tile.href = item.url;
        tile.download = "";
        tile.className = `
            group relative bg-white border border-slate-200 rounded-2xl p-5 
            flex flex-col justify-between h-full cursor-pointer
            transition-all duration-300 ease-in-out
            hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50/30
            animate-fade-in-up
        `;
        tile.style.animationDelay = `${delay}ms`;

        tile.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <i data-lucide="${iconName}" class="w-6 h-6"></i>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-white transition-colors">
                        ${item.model}
                    </span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">${item.title}</h3>
                
                <div class="flex flex-wrap gap-2 text-xs text-slate-500 mb-6">
                    <span class="flex items-center gap-1"><i data-lucide="tag" class="w-3 h-3"></i> ${item.type}</span>
                    <span class="flex items-center gap-1"><i data-lucide="hard-drive" class="w-3 h-3"></i> ${item.size}</span>
                    ${item.os ? `<span class="flex items-center gap-1"><i data-lucide="monitor" class="w-3 h-3"></i> ${item.os}</span>` : ''}
                </div>
            </div>
            
            <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-4 h-4"></i> ${item.date}</span>
                <div class="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Download <i data-lucide="download" class="w-4 h-4"></i>
                </div>
            </div>
        `;

        resultsGrid.appendChild(tile);
    });

    lucide.createIcons();
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query === "") {
        renderResults(downloadDatabase);
        return;
    }

    const filteredData = downloadDatabase.filter(item => 
        item.model.toLowerCase().includes(query) || 
        item.title.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
    );

    renderResults(filteredData, searchInput.value.trim());
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

renderResults(downloadDatabase);
