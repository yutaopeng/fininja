class Images {
    public static Wheel: string = 'wheel';
    public static Pin: string = 'pin';
    /**
     * A list of all images we need to show the preloader itself.
     * These should be loaded in the splash screen.
     */
    public static preloadList: string[] = [
        //Add images for the preloader
        Images.Wheel,
        Images.Pin
    ];

    /**
     * A list of all images we need after the preloader.
     */
    public static list: string[] = [
        //Add images to load
        Images.Wheel,
        Images.Pin
    ];
}
