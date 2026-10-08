import platform

if platform.architecture()[0] != "64bit":
    print("32bit Not Supported!")
else:
    try:
        import metasmct

        # Start the module's main entry point
        if hasattr(metasmct, "main_menu"):
            metasmct.main_menu()
        elif hasattr(metasmct, "main"):
            metasmct.main()
        else:
            print("Error:  function.")

    except Exception as e:
        import traceback
        print(f"\nCRITICAL ERROR: {e}")
        traceback.print_exc()
        input("\nPress Enter to exit...")
