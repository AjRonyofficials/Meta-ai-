import platform

if platform.architecture()[0] != "64bit":
    print("32bit Not Supported!")
else:
    try:
        import v7

        # Start the module's main entry point
        if hasattr(v7, "main_menu"):
            v7.main_menu()
        elif hasattr(v7, "main"):
            v7.main()
        else:
            print("Error:  function.")

    except Exception as e:
        import traceback
        print(f"\nCRITICAL ERROR: {e}")
        traceback.print_exc()
        input("\nPress Enter to exit...")
