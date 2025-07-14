import type { NavItem } from '$lib/types/nav';
import { docsStore } from '$lib/stores/docs-store.svelte';

class DocsNavigation {
	private static instance: DocsNavigation;
	public docNav = $state<NavItem[]>([]);

	private constructor() {}

	public static getInstance(): DocsNavigation {
		if (!DocsNavigation.instance) {
			DocsNavigation.instance = new DocsNavigation();
		}
		return DocsNavigation.instance;
	}

	public async generateNavigation(): Promise<NavItem[]> {
		const flatItems: NavItem[] = docsStore.getDocumentsForNavigation().map((doc) => ({
			title: doc.title,
			href: doc.href,
			disabled: doc.disabled,
			external: doc.external,
			label: doc.label
		}));

		const nestedItems = this.createNestedStructure(flatItems);
		this.docNav = this.cleanupEmptyItems(nestedItems);
		return this.docNav;
	}

	private createNestedStructure(items: NavItem[]): NavItem[] {
		// Вспомогательная функция для вложенного построения
		function insert(tree: NavItem[], pathParts: string[], item: NavItem) {
			if (pathParts.length === 0) {
				tree.push(item);
				return;
			}
			const folderName = pathParts[0];
			let folder = tree.find((n) => n.title === folderName && n.items);
			if (!folder) {
				folder = {
					title: folderName,
					items: []
				};
				tree.push(folder);
			}
			insert(folder.items!, pathParts.slice(1), item);
		}

		const tree: NavItem[] = [];
		for (const item of items) {
			if (!item.href) {
				tree.push(item);
				continue;
			}
			// Убираем /docs в начале
			let rel = item.href.replace(/^\/docs\/?/, '');
			const pathParts = rel.split('/').filter(Boolean);
			if (pathParts.length === 1) {
				tree.push(item);
			} else {
				// Последний сегмент — файл, предыдущие — папки
				insert(tree, pathParts.slice(0, -1), {
					...item,
					href: item.href
				});
			}
		}
		// Рекурсивно сортируем
		function sortNav(items: NavItem[]): NavItem[] {
			return items
				.sort((a, b) => {
					// Папки (с items) всегда выше файлов (без items)
					if (a.items && !b.items) return -1;
					if (!a.items && b.items) return 1;
					// Если оба папки или оба файлы, сортируем по алфавиту
					return (a.title || '').localeCompare(b.title || '');
				})
				.map((item) => (item.items ? { ...item, items: sortNav(item.items) } : item));
		}
		return sortNav(tree);
	}

	// Clean up empty items arrays
	private cleanupEmptyItems(items: NavItem[]): NavItem[] {
		return items.map((item) => {
			if (item.items?.length === 0) {
				const { items, ...rest } = item;
				return rest;
			} else if (item.items) {
				return {
					...item,
					items: this.cleanupEmptyItems(item.items)
				};
			}
			return item;
		});
	}

	private sortNavItems(items: NavItem[]): NavItem[] {
		return [...items]
			.sort((a, b) => {
				// If both items have sub-items or neither have sub-items, maintain current order
				if ((!a.items && !b.items) || (a.items && b.items)) {
					return 0;
				}
				// Items without sub-items should come first
				return a.items ? 1 : -1;
			})
			.map((item) => {
				// Recursively sort sub-items if they exist
				if (item.items) {
					return {
						...item,
						items: this.sortNavItems(item.items)
					};
				}
				return item;
			});
	}
}

export const docsNavigation = DocsNavigation.getInstance();
