import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { ResponsiveSizeInfoRx } from 'ngx-responsive';
import { CurrentUserService } from './current-user.service';
import { MENU_ITEMS } from './pages-menu';

@Component({
	selector: 'app-rng-pages',
	template: `
		<nb-layout [withScroll]="false" [responsive-window]="'pages'">
			<nb-layout-header fixed>
				<nb-actions>
					<nb-action
						style="padding: 0 0.5rem;"
						icon="menu-outline"
						(click)="toggleNav()"
						*hideItBootstrap="['lg', 'xl']"
					></nb-action>
					<nb-action style="padding: 0 0.5rem;">
						<img src="./assets/favicon.svg" style="height: 3rem;" />
					</nb-action>
					<nb-action style="padding: 0 0.5rem;"> <h3>RcloneNg</h3> </nb-action>
				</nb-actions>
			</nb-layout-header>

			<nb-sidebar class="main-sidebar" tag="nav" [fixed]="mainSideBarFixed" state="collapsed">
				<nb-menu [items]="menu"> </nb-menu>
			</nb-sidebar>

			<nb-layout-column class="colored-column-basic basic-contant" style="padding: 0;">
				<router-outlet></router-outlet>
			</nb-layout-column>
		</nb-layout>
	`,
	styles: [
		`
			.main-sidebar {
				z-index: 1039;
			}
		`,
	],
})
export class PagesComponent implements OnInit {
	constructor(
		private sidebarService: NbSidebarService,
		private currUserService: CurrentUserService,
		private resp: ResponsiveSizeInfoRx
	) {
		resp.connect();
	}
	menu = MENU_ITEMS;

	mainSideBarFixed = true;

	toggleNav() {
		this.sidebarService.toggle(false, 'nav');
	}

	ngOnInit(): void {
		this.resp.getResponsiveSize.subscribe(data => {
			this.mainSideBarFixed = data === 'xs' || data === 'sm' || data === 'md';
			if (!this.mainSideBarFixed) this.sidebarService.expand('nav');
			else this.sidebarService.collapse('nav');
		});
		this.currUserService.currentUserFlow$.getSupersetOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			const userGroup = this.menu[0];
			userGroup.title = node[0].name;
			userGroup.children = node[0].users
				.filter(x => x.name !== node[0].name) // disable show current user in child item
				.map(
					(x): NbMenuItem => {
						return {
							title: x.name,
							icon: 'person',
							link: 'user/login',
							queryParams: {
								name: x.name,
							},
						};
					}
				);
			userGroup.children.push({
				title: 'Manage',
				icon: 'grid-outline',
				link: 'user',
			});
		});
	}
}
