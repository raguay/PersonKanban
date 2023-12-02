export namespace main {
	
	export class ItemData {
	    id: number;
	    name: string;
	    Description: string;
	    color: string;
	    note: string[];
	
	    static createFrom(source: any = {}) {
	        return new ItemData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.Description = source["Description"];
	        this.color = source["color"];
	        this.note = source["note"];
	    }
	}
	export class ListData {
	    id: number;
	    name: string;
	    items: ItemData[];
	
	    static createFrom(source: any = {}) {
	        return new ListData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.items = this.convertValues(source["items"], ItemData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class BoardData {
	    id: number;
	    name: string;
	    list: ListData[];
	
	    static createFrom(source: any = {}) {
	        return new BoardData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.list = this.convertValues(source["list"], ListData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class GitHubRepos {
	    name: string;
	    url: string;
	    stars: number;
	    owner: string;
	    id: number;
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new GitHubRepos(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	        this.stars = source["stars"];
	        this.owner = source["owner"];
	        this.id = source["id"];
	        this.description = source["description"];
	    }
	}
	
	export class KanbanData {
	    boards: BoardData[];
	
	    static createFrom(source: any = {}) {
	        return new KanbanData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.boards = this.convertValues(source["boards"], BoardData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ThemeData {
	    backgroundcolor: string;
	    textcolor: string;
	    unselectTabColor: string;
	    unselectTabTextColor: string;
	    selectTabColor: string;
	    selectTabTextColor: string;
	    mainboardColor: string;
	    listcontainercolor: string;
	    listbgcolor: string;
	    listtextcolor: string;
	    itembgcolor: string;
	    itemtextcolor: string;
	    font: string;
	    fontsize: number;
	    dialogBGColor: string;
	    dialogTextColor: string;
	    kanbanInfo: string;
	
	    static createFrom(source: any = {}) {
	        return new ThemeData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.backgroundcolor = source["backgroundcolor"];
	        this.textcolor = source["textcolor"];
	        this.unselectTabColor = source["unselectTabColor"];
	        this.unselectTabTextColor = source["unselectTabTextColor"];
	        this.selectTabColor = source["selectTabColor"];
	        this.selectTabTextColor = source["selectTabTextColor"];
	        this.mainboardColor = source["mainboardColor"];
	        this.listcontainercolor = source["listcontainercolor"];
	        this.listbgcolor = source["listbgcolor"];
	        this.listtextcolor = source["listtextcolor"];
	        this.itembgcolor = source["itembgcolor"];
	        this.itemtextcolor = source["itemtextcolor"];
	        this.font = source["font"];
	        this.fontsize = source["fontsize"];
	        this.dialogBGColor = source["dialogBGColor"];
	        this.dialogTextColor = source["dialogTextColor"];
	        this.kanbanInfo = source["kanbanInfo"];
	    }
	}

}

