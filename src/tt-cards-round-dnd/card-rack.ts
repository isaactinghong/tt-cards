
export enum RACK_TYPE {
  TOP3 = 'TOP3',
  MIDDLE5='MIDDLE3',
  BOTTOM5='BOTTOM5',
}

export const RackBaseIndex = (rackType: RACK_TYPE) => { 
  switch (rackType) {
    case RACK_TYPE.MIDDLE5: 
      return 3;
    case RACK_TYPE.BOTTOM5: 
      return 8;
    default: 
      return 0;
  }
}

export const RackLastIndex = (rackType: RACK_TYPE) => { 
  switch (rackType) {
    case RACK_TYPE.MIDDLE5: 
      return 7;
    case RACK_TYPE.BOTTOM5: 
      return 12;
    default: 
      return 2;
  }
}

