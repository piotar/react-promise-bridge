export class UniqueId {
    private value: number = 0;

    public generate(): number {
        return this.value++;
    }
}
