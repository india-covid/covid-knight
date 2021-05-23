const mongoExpression = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
export const isMongoId = (id: any) => {
  return mongoExpression.test(id);
}
export const isNonEmptyArray = (a: any) => {
  return Array.isArray(a) && a.length;
};
