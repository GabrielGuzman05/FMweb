export class FeatureModel {
	
	constructor(root){
		this.root = root;
	}
}

export class Feature{
	
	constructor(name, description, toparent, tochild){
		this.name = name;
		this.description = description;
		this.toparent = toparent;
		this.tochild = tochild;
		this.association = [];
	}
	
	addAssociation(associationAux){
		this.association.push(associationAux);
	}
}

export class Parenthood{
	constructor(minCardinality, maxCardinality, mandatory, optional, parent, child){
		this.minCardinality = minCardinality;
		this.maxCardinality - maxCardinality;
		this.mandatory = mandatory;
		this.optional = optional;
		this.parent = parent;
		this.child = child;
	}
}

export class LogicAssociation{
	constructor(type){
		this.type = type;
		this.brothers = [];
	}
	
	addBrother(brother){
		this.brothers.push(brother);
	}
}

export class LogicAssociationType{
	static OR = new LogicAssociationType('OR');
	static XOR = new LogicAssociationType('XOR');
	
	constructor(name){
		this.name = name;
	}
}

export class Dependency{
	constructor(type, from, to){
		this.type = type;
		this.from = from;
		this.to = to;
	}
}

export class DependencyType{
	static REQUIRES = new DependencyType('REQUIRES');
	static EXCLUDES = new DependencyType('EXCLUDES');
	
	constructor(name){
		this.name = name;
	}
}